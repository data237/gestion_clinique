import '../../styles/Zonedaffichage.css'
import Styled from 'styled-components'
//import axios from 'axios';
import React from 'react';
//import { useEffect, useState } from 'react';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'

const SousDiv1Style = Styled.div`
 width: 100%;
 padding-left: 32px;
 padding-right: 32px;
`
const Span1= Styled.span`
    cursor: pointer;
`
const SousDiv2Style = Styled.div`
    width: 100%;
  padding-left: 32px;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`
function Dashboard(){
    const nomprofil = localStorage.getItem('username');
    return (
    <>
    
        <SousDiv1Style>
                <Barrehorizontal1 titrepage="Dashboard" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1>Home</Span1>
                </Barrehorizontal1>
        </SousDiv1Style>

        <SousDiv2Style>
                
                
                <div className='zonedaffichage-dashboad'>
                    
                    <div className='numero'>
                        <h2 className='nomtable'> Statistiques globales </h2>
                    </div>
                            
                    <div className='conteneurbarre'>
                        <div className='barre'></div>
                    </div>
                    <div className='tableau-board'>
                    
                        <div className='conteneur-1'>
                            <div className='sconteneur-01'>
                                <div className='sconteneur-001'>
                                    <div className='conteneur-0001'>
                                        <h2> Ce compte </h2>
                                        <p> bdnoduhfsd,fàjzehgogonhbidnbgdfnkbkidfhbghdgh</p>
                                    </div>
                                    <div className='conteneur-0011'>
                                        <h2> Aujourd'hui </h2>
                                        <p> bdnoduhfsd,fàjzehgogonhbidnbgdfnkbkidnhmenshgfbd</p>
                                    </div>
                                </div>
                                <div className='conteneur-011'>
                                        <p> jnoeoerngonoigoieegioegioingeoiegoiengneorgnegnegnoengengoeng</p>
                                </div>
                            </div>
                            <div className='conteneur-11'>
                                <p> jnoeoerngonoigoieegioegioingeoie nknjknkjbhjk hbhkbkjbiub;bnlhibk</p>
                            </div>
                        </div>
                        <div className='conteneur-2'>
                                <p> njnonznonnvznnvclonln</p>
                        </div>
                    </div>
                </div>

               
                
            </SousDiv2Style>
    
    </>)
}

export default Dashboard