import React, { useState, useRef, useEffect } from 'react';
import skillsData from './skills.json';
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import aceImage from '../imagenes/ace.png';
import iconsImage from '../imagenes/icons.png';

const Builder = () => {
    const MAX_SKILL_POINTS = 120;
  
    // State to keep track of selected skills and their points
    const [selectedSkills, setSelectedSkills] = useState({});
    // const [totalSkillPoints, setTotalSkillPoints] = useState(0);
  

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
  // Function to handle selecting or unselecting a skill
  const handleSkillSelect = (skillName) => {
    const skillInfo = organizedSkillsFlat.find((skill) => skill.name === skillName);

    if (skillInfo) {
      setSelectedSkills((prevSelectedSkills) => {
        const newSelectedSkills = { ...prevSelectedSkills };
        const currentSelected = prevSelectedSkills[skillName];

        if (!currentSelected) {
          // Skill is not selected, add it and its state (basic or ace)
          if (totalSkillPoints + skillInfo.basic <= MAX_SKILL_POINTS) {
            newSelectedSkills[skillName] = 'basic';
          } else {
            // Skill points exceed the maximum allowed
            alert('Maximum skill points exceeded!');
          }
        } else if (currentSelected === 'basic') {
          // Toggle to 'Ace' state
          newSelectedSkills[skillName] = 'ace';
        } else if (currentSelected === 'ace') {
          // Toggle to 'Unselected' state
          delete newSelectedSkills[skillName];
        }

        return newSelectedSkills;
      });
    } else {
      console.error(`Invalid skill for: ${skillName}`);
    }
  };

  // Calculate the totalSkillPoints based on the selected skills
  const totalSkillPoints = Object.entries(selectedSkills).reduce((total, [skillName, state]) => {
    const skillInfo = organizedSkillsFlat.find((skill) => skill.name === skillName);
    if (skillInfo) {
      const points = state === 'ace' ? skillInfo.ace + skillInfo.basic : skillInfo.basic;
      return total + points;
    }
    return total;
  }, 0);

 // Calculate subtotals for each tree
 const treeSubtotals = {};
 Object.keys(organizedSkills).forEach((tree) => {
   treeSubtotals[tree] = Object.values(organizedSkills[tree])
     .flat()
     .reduce((subtotal, skill) => {
       if (isSkillSelected(skill.name)) {
         subtotal += selectedSkills[skill.name] === 'basic' ? skill.basic : skill.ace + skill.basic;
       }
       return subtotal;
     }, 0);
 });

   // TOGGLE VISIBILITY OF A SPECIFIC CATEGORY
   const [categoryVisibility, setCategoryVisibility] = useState(() => {
    const initialVisibility = {};
    Object.keys(organizedSkills).forEach((tree) => {
      initialVisibility[tree] = false;
    });
    return initialVisibility;
  });

  const toggleCategoryVisibility = (category) => {
    setCategoryVisibility((prevVisibility) => ({
      ...prevVisibility,
      [category]: !prevVisibility[category],
    }));
  };


  const exportSelectedSkills = () => {
    const data = JSON.stringify(selectedSkills, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selectedSkills.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importSelectedSkills = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const importedSkills = JSON.parse(e.target.result);
        setSelectedSkills(importedSkills);
        // alert('Selected skills imported successfully!');
      } catch (error) {
        alert('Error importing selected skills.');
      }
    };
  
    reader.readAsText(file);
  };
  
  function UploadButton({ handleFileChange }) {
    const inputFileRef = useRef(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
  
    useEffect(() => {
      inputFileRef.current = document.getElementById('input-file');
    }, []);
  
    const handleUpload = () => {
      inputFileRef.current.click();
    };
  
    const handleDisplayFileDetails = () => {
      if (inputFileRef.current?.files && inputFileRef.current.files.length > 0) {
        setUploadedFileName(inputFileRef.current.files[0].name);
      }
    };
  
    const handleImport = () => {
      inputFileRef.current.click();
    };
  
    return (
      <div>
        <input
          id="input-file"
          onChange={(e) => {
            handleDisplayFileDetails();
            handleFileChange(e);
          }}
          className="d-none"
          type="file"
          accept=".json"
        />
        <button
          onClick={handleImport}
          className={`btn btn-outline-${uploadedFileName ? 'success' : 'primary'}`}
        >
          {uploadedFileName ? uploadedFileName : 'Load profiles'}
        </button>
      </div>
    );
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedSkills = JSON.parse(e.target.result);
        setSelectedSkills(importedSkills);
        alert('Selected skills imported successfully!');
      } catch (error) {
        alert('Error importing selected skills.');
      }
    };

    reader.readAsText(file);
  };  

  function goToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

        return (
        <div className="container">

          <div className="totalSkillPointsDIV">
            <div className="totalSkillPoints">
              <span>Rem. SP</span>
              <br />
              <span>{120-totalSkillPoints}</span>
            </div>
          </div>
          
          <div className="buttonsSkills">
            <Button onClick={exportSelectedSkills}>Export Skills</Button>
            <UploadButton handleFileChange={handleFileChange} />
          </div>

          {Object.entries(sortedOrganizedSkills).map(([treeName, subtrees]) => (
            <div key={treeName} className="tree">
              <h2 className="treeName" onClick={() => toggleCategoryVisibility(treeName)}>{treeName.toUpperCase()} ({treeSubtotals[treeName]})</h2>
              {categoryVisibility[treeName] && (
            <React.Fragment>
              {Object.entries(subtrees).map(([subtreeName, skills]) => {
                const tiers = [1, 2, 3, 4].reverse(); // Inverted tiers
                return (
                  <div key={subtreeName} className="subtree">
                    <h3 className="subtreeName">{subtreeName.toUpperCase()}</h3>
                    {tiers.map((tier) => {
                      const tierSkills = skills.filter((skill) => skill.tier === tier);
    
                      return (
                        <Row key={tier}>
                          {tierSkills.map((skill) => (
                            <Col key={skill.name} className="skillCol">
                              <Button
                                onClick={() => handleSkillSelect(skill.name)}
                                variant={
                                  selectedSkills[skill.name] === 'basic'
                                    ? 'primary'
                                    : selectedSkills[skill.name] === 'ace'
                                    ? 'outline-info'
                                    : 'outline-secondary'
                                }
                                className="skillButton"
                                title={skill.description}
                                style={{
                                  backgroundImage:
                                    selectedSkills[skill.name] === 'basic'
                                      ? 'none'
                                      : selectedSkills[skill.name] === 'ace'
                                      ? `url(${aceImage})`
                                      : 'none',
                                      backgroundSize: '50px',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'center',
                                      overflow: 'visible',
                                }}
                              >
                                {selectedSkills[skill.name] === 'basic'
                                  ? 'Basic'
                                  : selectedSkills[skill.name] === 'ace'
                                  ? ' '
                                  : '🔒'}
                              </Button>
                                <div>
                                <span
                                style={{
                                  fontWeight:
                                    selectedSkills[skill.name] === 'basic'
                                      ? 'bold'
                                      : selectedSkills[skill.name] === 'ace'
                                      ? 'bold'
                                      : '',
                                  color:
                                    selectedSkills[skill.name] === 'basic'
                                      ? '#0D6EFD'
                                      : selectedSkills[skill.name] === 'ace'
                                      ? '#08AFFF'
                                      : '#6C757D',
                                }}
                                >
                                    {skill.name}
                                  </span>
                                </div>
                            </Col>
                          ))}
                        </Row>
                      );
                    })}
                  </div>
                );
              })}
              </React.Fragment>
          )}
            </div>
          ))}
          <Button className="buttonGoToTop" onClick={() => goToTop()}>Go to top</Button>
        </div>
      );
  };
  
  export default Builder;
  