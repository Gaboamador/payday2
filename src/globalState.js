import Context from './context'
import {useState} from 'react'

function GlobalState(props){

    const [selectedSkills2, setSelectedSkills2] = useState(localStorage.getItem('selectedSkills')!==undefined && localStorage.getItem('selectedSkills')!==null? localStorage.getItem('selectedSkills') : {})
    // const [selectedSkills, setSelectedSkills] = useState({})

    const loadSelectedSkillsFromLocalStorage = () => {
        const savedSkills = localStorage.getItem('selectedSkills');
        return savedSkills ? JSON.parse(savedSkills) : Array.from({ length: 15 }, () => ({
        skills: {},
        primaryWeapon: null,
        secondaryWeapon: null,
        perkDeck: null,
        armor: null,
        throwable: null,
        equipment: null,
        melee: null,
        equipment1: null,
        equipment2: null,
        }));
        };
        const [selectedSkills, setSelectedSkills] = useState(() => {
        return loadSelectedSkillsFromLocalStorage();
        });


    return(
        <Context.Provider value={{
            selectedSkills:selectedSkills,
            setSelectedSkills:setSelectedSkills,
        }}>
            {props.children}
        </Context.Provider>
    )
}

export default GlobalState;