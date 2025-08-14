import './tableau.css'
import React from 'react';
import { useEffect, useState } from 'react';
import Styled from 'styled-components'


const NumeroStyle = Styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
`
const DivbuttonStyle = Styled.div`
    display: flex;
    gap: 15px;
`
const ButtonStyle = Styled.button`
    padding: 8px 12px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 14px;
    background-color: ${props => props.$buttonbackgroundColor || '#ffffff'};
    color: ${props => props.$buttonColor || '#333333'};
    border: 1px solid #d1d5db;
    border-radius: 6px;
    gap: 0px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover{
        cursor: pointer;
        background-color: #667eea;
        color: #ffffff;
        border-radius: 6px;
    }
    &:focus{
        cursor: pointer;
        background-color: #667eea;
        color: #ffffff;
        border-radius: 6px;
    }
    &:disabled {
        background-color: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
        border-color: #e5e7eb;
    }
`

const ButtonPSStyle = Styled.button`
    padding: 8px 16px;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 14px;
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover{
        cursor: pointer;
        background-color: #f8f9fa;
        border-color: #9ca3af;
        color: #374151;
    }
    &:disabled {
        background-color: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
        border-color: #e5e7eb;
    }
`

const NomtableStyle = Styled.p`
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 1.5em;
    color: #333333;
`
const BarreStyle = Styled.div`
    width: 100%;
    height: 5px;
    border-radius: 2.5px;
    background-color: rgba(159, 159, 255, 1);
    padding-left:  20px;

`
function UtilisateurTable(){
  const [currentPage, setCurrentPage] = useState(1);
   const [utilisateurs, setutilisateurs] = useState([]);
   const [selectedutilisateurs, setSelectedutilisateurs] = useState([]);
 


  const utilisateursPerPage = 7;

  const handleCheckboxChange = (id) => {
  setSelectedutilisateurs((prevSelected) =>
    prevSelected.includes(id)
      ? prevSelected.filter((pid) => pid !== id)
      : [...prevSelected, id]
  );
};


    useEffect(() => {
    fetch('/utilisateurs.json')
      .then(response => response.json())
      .then(data => setutilisateurs(data));
  }, []);

const [pagesToShow, setpagesToShow] = useState([]);
const totalPages = Math.ceil(utilisateurs.length / utilisateursPerPage);

useEffect(() => {
  if (totalPages >= 6) {
    setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
  } else {
    const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
    setpagesToShow(fullList);
  }
}, [utilisateurs.length, totalPages]);

  //let pagesToShow = [1, 2, 3, "...", totalPages - 1, totalPages];

  const handleClick = (page) => {
        if (page !== "..." && page !== currentPage) {
        setCurrentPage(page);
        }
    }
    console.log(pagesToShow) 


    // boutton

    const Status = (id) => {
    setutilisateurs((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // gestion pagination

  //const modifiernumeropage = (indexAModifier, nouveauNom) => {
   //     const nouvelleListe = pagesToShow.map((fruit, index) =>
   //         index === indexAModifier ? nouveauNom : fruit
   //     );
    //    setpagesToShow(nouvelleListe);
   // };

const modification = (numeropage) => {
    let nouvelleListe = [...pagesToShow] // copie de l'ancien tableau

    if (numeropage > 2 && numeropage < totalPages - 2) {
        nouvelleListe[0] = numeropage - 2
        nouvelleListe[1] = numeropage - 1
        nouvelleListe[2] = numeropage
        nouvelleListe[3] = '...'
    } else if (numeropage === totalPages - 2) {
        nouvelleListe[0] = numeropage - 3
        nouvelleListe[1] = numeropage - 2
        nouvelleListe[2] = numeropage - 1
        nouvelleListe[3] = numeropage
    } else {
        // Peut-être une autre logique ici ?
    }
    console.log(pagesToShow)
    setpagesToShow(nouvelleListe)
}
//const paginationPrecedent = (currentPage)=>{
 //   setCurrentPage(currentPage - 1)
 //   modification(currentPage)
//}
  const indexOfLastutilisateur = currentPage * utilisateursPerPage;
  const indexOfFirstutilisateur = indexOfLastutilisateur - utilisateursPerPage;
  const currentutilisateurs = utilisateurs.slice(indexOfFirstutilisateur, indexOfLastutilisateur);

  

  return (
    <div>
        <NumeroStyle style={{ marginTop: '10px' }}>
            <div>
                <NomtableStyle> Utilisateurs </NomtableStyle>
            </div>
            <DivbuttonStyle >
                <ButtonPSStyle onClick={() => {setCurrentPage(currentPage - 1)
                    modification(currentPage - 1 )
                }}
                        disabled={currentPage === 1}>Précédent</ButtonPSStyle>
                <div>
                        {pagesToShow.map((page, idx) => (
                            <ButtonStyle
                            key={idx}
                            onClick={() => handleClick(page)}
                            $buttonbackgroundColor = {page === currentPage ? 'rgba(65, 65, 255, 1)' : ''}
                            $buttonColor = {page === currentPage ? 'white' : ''}
                            disabled={page === "..."}
                            >
                            {page}
                            </ButtonStyle>
                        ))}
                </div>
                
                <ButtonPSStyle onClick={() => {setCurrentPage(currentPage + 1 )
                    modification(currentPage + 1 )
                }}
                 disabled={currentPage === totalPages}>Suivant</ButtonPSStyle>
            </DivbuttonStyle >
            
        </NumeroStyle>
        <div style={{ margin: '20px 20px' }}>
            <BarreStyle></BarreStyle>
        </div>
        
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
           
            <th className='action'>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentutilisateurs.map((utilisateur, index) => (
            <tr key={index} className='tr'>
              <td><input
                    type="checkbox"
                    checked={selectedutilisateurs.includes(utilisateur.id)}
                    onChange={() => handleCheckboxChange(utilisateur.id)}
                />
            </td>
              <td className={`${utilisateur.isActive ? "off" : ""}`}>{utilisateur.nom}</td>
              <td className={`${utilisateur.isActive ? "off" : ""}`}>{utilisateur.prenom}</td>
              <td className={`${utilisateur.isActive ? "off" : ""}`}>{utilisateur.email}</td>
              <td className={`${utilisateur.isActive ? "off" : ""}`}>{utilisateur.rôle}</td>
              <td className={`${utilisateur.isActive ? "off" : ""}`}>{utilisateur.isActive ? "inactive" : "actif"}</td>
              <td className='bouttons'>
                <button
                    onClick={() => Status(utilisateur.id)}
                    className={`-button ${utilisateur.isActive ? "on" : ""}`}
                    >
                <div className={ `circle  ${utilisateur.isActive  ? "active" : ""}`} ></div></button>
                <button>🗑️</button>
                {utilisateur.isActive}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default UtilisateurTable;