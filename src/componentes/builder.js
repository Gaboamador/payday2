import React, { useState } from 'react';
import skillsData from './skills.json';
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';

const Builder = () => {
    const MAX_SKILL_POINTS = 120;
  
    // State to keep track of selected skills and their points
    const [selectedSkills, setSelectedSkills] = useState({});
    const [totalSkillPoints, setTotalSkillPoints] = useState(0);
  

 // Function to check if a skill is already selected
 const isSkillSelected = (skillName) => selectedSkills.hasOwnProperty(skillName);
  
 // Convert skillsData object to an array of skills
 const skillsArray = Object.values(skillsData);

 // Organize skills by trees and subtrees
 const organizedSkills = {};

 for (const skill of skillsArray) {
   const { name, description, basic, ace, tier, subtree, tree } = skill;

   if (!organizedSkills[tree]) {
     organizedSkills[tree] = {};
   }

   if (!organizedSkills[tree][subtree]) {
     organizedSkills[tree][subtree] = [];
   }

   organizedSkills[tree][subtree].push({
     name,
     description,
     basic,
     ace,
     tier,
   });
 }

 const sortedOrganizedSkills = Object.entries(organizedSkills).reduce(
     (sortedSkills, [treeName, subtrees]) => {
       sortedSkills[treeName] = Object.entries(subtrees).reduce(
         (sortedSubtrees, [subtreeName, skills]) => {
           const sortedSkillsInSubtree = skills.sort((a, b) => b.tier - a.tier);
           sortedSubtrees[subtreeName] = sortedSkillsInSubtree;
           return sortedSubtrees;
         },
         {}
       );
       return sortedSkills;
     },
     {}
   );

 // Flatten organizedSkills object into an array
 const organizedSkillsFlat = Object.entries(organizedSkills).reduce((acc, [treeName, subtrees]) => {
    return [
      ...acc,
      ...Object.entries(subtrees).reduce((subtreeAcc, [subtreeName, skills]) => {
        return [
          ...subtreeAcc,
          ...skills.map((skill) => ({
            ...skill,
            tree: treeName,
            subtree: subtreeName,
          })),
        ];
      }, []),
    ];
  }, []);

    
 // Function to handle selecting or unselecting a skill
 const handleSkillSelect = (skillName) => {
    const skillInfo = organizedSkillsFlat.find((skill) => skill.name === skillName);
    
    if (skillInfo) {
      setSelectedSkills((prevSelectedSkills) => {
        const newSelectedSkills = { ...prevSelectedSkills };
        const currentSelected = prevSelectedSkills[skillName];
  console.log(currentSelected, "current selected")
        if (!currentSelected) {
          // Skill is not selected, add it and its points
          if (totalSkillPoints + skillInfo.basic <= MAX_SKILL_POINTS) {
            newSelectedSkills[skillName] = 'basic';
            setTotalSkillPoints((prevTotal) => prevTotal + skillInfo.basic);
          } else {
            // Skill points exceed the maximum allowed
            alert('Maximum skill points exceeded!');
          }
        } else if (currentSelected === 'basic') {
          // Toggle to 'Ace' state
          newSelectedSkills[skillName] = 'ace';
          setTotalSkillPoints((prevTotal) => prevTotal + skillInfo.ace - skillInfo.basic);
        } else if (currentSelected === 'ace') {
          // Toggle to 'Unselected' state
          delete newSelectedSkills[skillName];
          setTotalSkillPoints((prevTotal) => prevTotal - skillInfo.ace);
        }
  
        return newSelectedSkills;
      });
    } else {
      console.error(`Invalid skill for: ${skillName}`);
    }
  };
  
  
  
  
  
  
  
  
  
  
    // const handleSkillSelect = (skillName, isAce) => {
    //   let skillInfo;
    //   for (const tree of Object.values(organizedSkills)) {
    //     for (const subtreeSkills of Object.values(tree)) {
    //       const foundSkill = subtreeSkills.find((skill) => skill.name === skillName);
    //       if (foundSkill) {
    //         skillInfo = foundSkill;
    //         break;
    //       }
    //     }
    //     if (skillInfo) break;
    //   }
  
    //   if (skillInfo) {
    //     const points = isAce ? skillInfo.ace : skillInfo.basic;
  
    //     if (isSkillSelected(skillName)) {
    //       setSelectedSkills((prevSelectedSkills) => {
    //         const newSelectedSkills = { ...prevSelectedSkills };
    //         delete newSelectedSkills[skillName];
    //         return newSelectedSkills;
    //       });
    //       setTotalSkillPoints((prevTotal) => prevTotal - points);
    //     } else {
    //       if (totalSkillPoints + points <= MAX_SKILL_POINTS) {
    //         setSelectedSkills((prevSelectedSkills) => ({
    //           ...prevSelectedSkills,
    //           [skillName]: isAce,
    //         }));
    //         setTotalSkillPoints((prevTotal) => prevTotal + points);
    //       } else {
    //         alert('Maximum skill points exceeded!');
    //       }
    //     }
    //   } else {
    //     console.error(`Invalid skill or missing basic/ace property for: ${skillName}`);
    //   }
    // };
  
   


      return (
        <div>
          <div>
            <h3>Total Skill Points: {totalSkillPoints}</h3>
          </div>
          {Object.entries(sortedOrganizedSkills).map(([treeName, subtrees]) => (
            <div key={treeName}>
              <h2>{treeName}</h2>
              {Object.entries(subtrees).map(([subtreeName, skills]) => {
                const tiers = [1, 2, 3, 4].reverse(); // Inverted tiers
    
                return (
                  <div key={subtreeName}>
                    <h3>{subtreeName}</h3>
                    {tiers.map((tier) => {
                      const tierSkills = skills.filter((skill) => skill.tier === tier);
    
                      return (
                        <Row key={tier}>
                          {tierSkills.map((skill) => (
                            <Col key={skill.name}>
                              <Button
                                onClick={() => handleSkillSelect(skill.name)}
                                variant={
                                  selectedSkills[skill.name] === 'basic'
                                    ? 'outline-primary'
                                    : selectedSkills[skill.name] === 'ace'
                                    ? 'outline-success'
                                    : 'outline-secondary'
                                }
                              >
                                {selectedSkills[skill.name] === 'basic'
                                  ? 'Basic'
                                  : selectedSkills[skill.name] === 'ace'
                                  ? 'Ace'
                                  : 'Unselect'}
                              </Button>
                              {selectedSkills[skill.name] && (
                                <div>
                                  <span>{skill.name}</span>
                                </div>
                              )}
                            </Col>
                          ))}
                        </Row>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    //   return (
    //     <div>
    //       <div>
    //         <h3>Total Skill Points: {totalSkillPoints}</h3>
    //       </div>
    //       {Object.entries(sortedOrganizedSkills).map(([treeName, subtrees]) => (
    //         <div key={treeName}>
    //           <h2>{treeName}</h2>
    //           {Object.entries(subtrees).map(([subtreeName, skills]) => {
    //             const tiers = [1, 2, 3, 4].reverse(); // Inverted tiers
      
    //             return (
    //               <div key={subtreeName}>
    //                 <h3>{subtreeName}</h3>
    //                 {tiers.map((tier) => {
    //                   const tierSkills = skills.filter((skill) => skill.tier === tier);
      
    //                   return (
    //                     <Row key={tier}>
    //                       {tierSkills.map((skill) => (
    //                         <Col key={skill.name}>
    //                           <div>
    //                             <Button
    //                               onClick={() => handleSkillSelect(skill.name, false)}
    //                               disabled={isSkillSelected(skill.name) && !selectedSkills[skill.name]}
    //                             >
    //                               Basic
    //                             </Button>
    //                             <Button
    //                               onClick={() => handleSkillSelect(skill.name, true)}
    //                               disabled={isSkillSelected(skill.name) && selectedSkills[skill.name]}
    //                             >
    //                               Ace
    //                             </Button>
    //                             {isSkillSelected(skill.name) && (
    //                               <Button
    //                                 onClick={() => handleSkillSelect(skill.name, selectedSkills[skill.name])}
    //                               >
    //                                 Unselect
    //                               </Button>
    //                             )}
    //                           </div>
    //                           <div>
    //                             <span>{skill.name}</span>
    //                           </div>
    //                         </Col>
    //                       ))}
    //                     </Row>
    //                   );
    //                 })}
    //               </div>
    //             );
    //           })}
    //         </div>
    //       ))}
    //     </div>
    //   );
      
      
      
      
  };
  
  export default Builder;
  