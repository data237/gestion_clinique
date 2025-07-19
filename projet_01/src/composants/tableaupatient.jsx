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
    padding: 5px 5px;
    font-family: Roboto;
    font-weight: 300;
    font-size: 1em;
    background-color: ${props => props.$buttonbackgroundColor};
    color: ${props => props.$buttonColor};
    border-radius: 5px;
    gap: 0px;
     &:hover{
        cursor: pointer;
        background-color: rgba(65, 65, 255, 1);
        border-radius: 5px;
    }
    &:focus{
        cursor: pointer;
        background-color: rgba(65, 65, 255, 1);
        color: white;
        border-radius: 5px;
    }
    
`
const ButtonPSStyle = Styled.button`
    padding: 5px 5px;
    font-family: Roboto;
    font-weight: 300;
    font-size: 1em;
     &:hover{
        cursor: pointer;
    }
`

const NomtableStyle = Styled.p`
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 1.5em;
`
const BarreStyle = Styled.div`
    width: 100%;
    height: 5px;
    border-radius: 2.5px;
    background-color: rgba(159, 159, 255, 1);
    padding-left:  20px;

`
function PatientsTable(){
  const [currentPage, setCurrentPage] = useState(1);
   const [patients, setPatients] = useState([]);
   const [selectedPatients, setSelectedPatients] = useState([]);
 


  const patientsPerPage = 5;

  const handleCheckboxChange = (id) => {
  setSelectedPatients((prevSelected) =>
    prevSelected.includes(id)
      ? prevSelected.filter((pid) => pid !== id)
      : [...prevSelected, id]
  );
};


    useEffect(() => {
    fetch('/patients.json')
      .then(response => response.json())
      .then(data => setPatients(data));
  }, []);

const [pagesToShow, setpagesToShow] = useState([]);
const totalPages = Math.ceil(patients.length / patientsPerPage);

useEffect(() => {
  if (totalPages >= 6) {
    setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
  } else {
    const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
    setpagesToShow(fullList);
  }
}, [patients.length, totalPages]);

  //let pagesToShow = [1, 2, 3, "...", totalPages - 1, totalPages];

  const handleClick = (page) => {
        if (page !== "..." && page !== currentPage) {
        setCurrentPage(page);
        }
    }





    //toggle boutton

    const toggleStatus = (id) => {
    setPatients((prevData) =>
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
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

  

  return (
    <div>
        <NumeroStyle style={{ marginTop: '10px' }}>
            <div>
                <NomtableStyle> Patients </NomtableStyle>
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
            <th>Téléphone</th>
            <th>Date_naissance</th>
            <th>Adresse</th>
            <th>Sexe</th>
            <th>Groupe Sanguin</th>
            <th className='action'>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient, index) => (
            <tr key={index}>
              <td><input
                    type="checkbox"
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => handleCheckboxChange(patient.id)}
                />
            </td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.nom}</td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.prenom}</td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.email}</td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.telephone}</td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.date_naissance}</td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.adresse}</td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.sexe}</td>
              <td className={`${patient.isActive ? "off" : ""}`}>{patient.groupe_sanguin}</td>
              <td className='bouttons'>
                <button
                    onClick={() => toggleStatus(patient.id)}
                    className={`toggle-button ${patient.isActive ? "on" : ""}`}
                    >
                <div className={ `circle  ${patient.isActive  ? "active" : ""}`} ></div></button>
                <button>🗑️</button>
                {patient.isActive}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default PatientsTable;