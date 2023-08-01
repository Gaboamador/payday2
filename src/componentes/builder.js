import React, { useState, useRef, useEffect } from 'react';
import skillsData from '../database/skills.json';
import primaryWeapons from '../database/primary.json';
import secondaryWeapons from '../database/secondary.json';
import perkDecks from '../database/perkDecks.json';
import armors from '../database/armors.json';
import throwables from '../database/throwables.json';
import equipments from '../database/equipments.json';
import melees from '../database/melees.json';
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import aceImage from '../imagenes/ace.png';
import lockSkill from '../imagenes/lock_skill.png';
import basicImage from '../imagenes/background.png'
import iconSkills from '../imagenes/icons.png'

const Builder = () => {
    const MAX_SKILL_POINTS = 120;
  
  //  // State to keep track of selected skills and their points for all profiles
  // const [selectedSkills, setSelectedSkills] = useState(() => {
  //   // Initialize the array with 15 profiles, each with an empty object of selected skills
  //   return Array.from({ length: 15 }, () => ({}));
  // });

  const saveSelectedSkillsToLocalStorage = (selectedSkills) => {
    localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills));
  };
  
  const loadSelectedSkillsFromLocalStorage = () => {
    const savedSkills = localStorage.getItem('selectedSkills');
    return savedSkills ? JSON.parse(savedSkills) : Array.from({ length: 15 }, () => ({
    skills: {}, // Object for selected skills (same as before)
    primaryWeapon: null,
    secondaryWeapon: null,
    perkDeck: null,
    armor: null,
    throwable: null,
    equipment: null,
    melee: null,
    }));
  };
  const [selectedSkills, setSelectedSkills] = useState(() => {
    return loadSelectedSkillsFromLocalStorage();
  });
  
  useEffect(() => {
    saveSelectedSkillsToLocalStorage(selectedSkills);
  }, [selectedSkills]);

  const handleResetSkills = () => {
    setSelectedSkills(Array.from({ length: 15 }, () => ({})));
    localStorage.removeItem('selectedSkills');
  };

 const handleResetProfile = () => {
    const confirmed = window.confirm(`Are you sure you want to reset Profile ${currentProfile}? This will clear all selected skills and categories.`);
  if (confirmed) {
    setSelectedSkills((prevSelectedSkills) => {
      const newSelectedSkills = [...prevSelectedSkills];
      newSelectedSkills[currentProfile - 1] = {};
      return newSelectedSkills;
    });
  }
};


  
  const [currentProfile, setCurrentProfile] = useState(1); // The default selected profile


  
 // Convert skillsData object to an array of skills
 const skillsArray = Object.values(skillsData);

 // Organize skills by trees and subtrees
 const organizedSkills = {};

 for (const skill of skillsArray) {
   const { idWidth, idHeight, name, description, basic, ace, tier, subtree, tree } = skill;

   if (!organizedSkills[tree]) {
     organizedSkills[tree] = {};
   }

   if (!organizedSkills[tree][subtree]) {
     organizedSkills[tree][subtree] = [];
   }

   organizedSkills[tree][subtree].push({
     idWidth,
     idHeight,
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
    
   // Function to handle selecting or unselecting a skill for the current profile
   const handleSkillSelect = (skillName) => {
    const skillInfo = organizedSkillsFlat.find((skill) => skill.name === skillName);
  
    if (skillInfo) {
      setSelectedSkills((prevSelectedSkills) => {
        const newSelectedSkills = prevSelectedSkills.map((profileSkills) => ({ ...profileSkills }));
        const currentSelected = newSelectedSkills[currentProfile - 1][skillName];
  
        if (!currentSelected) {
          // Skill is not selected, add it and its state (basic or ace)
            if (getProfileTotalPoints(newSelectedSkills, currentProfile - 1) + skillInfo.basic <= MAX_SKILL_POINTS) {
            newSelectedSkills[currentProfile - 1][skillName] = 'basic';
          } else {
            // Skill points exceed the maximum allowed
            // alert('Maximum skill points exceeded!');
          }
        } else if (currentSelected === 'basic') {
          // Toggle to 'Ace' state
          newSelectedSkills[currentProfile - 1][skillName] = 'ace';
        } else if (currentSelected === 'ace') {
          // Toggle to 'Unselected' state
          delete newSelectedSkills[currentProfile - 1][skillName];
        }
  
        return newSelectedSkills;
      });
    } else {
      console.error(`Invalid skill for: ${skillName}`);
    }
  };
  
  
  
  

// Function to calculate the total skill points for a given profile
const getProfileTotalPoints = (skills, profileIndex) => {
  let totalPoints = 0;
  const currentSkills = skills[profileIndex] || {};
  Object.entries(currentSkills).forEach(([skillName, state]) => {
    const skillInfo = organizedSkillsFlat.find((skill) => skill.name === skillName);
    if (skillInfo) {
      const points = state === 'ace' ? skillInfo.ace + skillInfo.basic : skillInfo.basic;
      totalPoints += points;
    }
  });
  return totalPoints;
};


// Calculate the totalSkillPoints based on the selected skills for the current profile
const totalSkillPoints = getProfileTotalPoints(selectedSkills, currentProfile - 1);

 // Calculate subtotals for each tree
 const treeSubtotals = {};
 Object.keys(organizedSkills).forEach((tree) => {
   treeSubtotals[tree] = Object.values(organizedSkills[tree])
     .flat()
     .reduce((subtotal, skill) => {
       if (selectedSkills[currentProfile - 1][skill.name]) {
         subtotal += selectedSkills[currentProfile - 1][skill.name] === 'basic' ? skill.basic : skill.ace + skill.basic;
       }
       return subtotal;
     }, 0);
 });


 const handleSelectPrimaryWeapon = (profileIndex, subcategoryName, weaponName) => {
  setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Update the selected primary weapon for the selected profile
    selectedProfile.primaryWeapon = { subcategory: subcategoryName, weapon: weaponName };

    return newSelectedSkills;
  });
};

const handleSelectSecondaryWeapon = (profileIndex, subcategoryName, weaponName) => {
  setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Update the selected primary weapon for the selected profile
    selectedProfile.secondaryWeapon = { subcategory: subcategoryName, weapon: weaponName };

    return newSelectedSkills;
  });
};

const handleSelectPerkDeck = (profileIndex, selectedPerkDeck) => {
  setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Update the selected perk deck for the selected profile
    selectedProfile.perkDeck = selectedPerkDeck;

    return newSelectedSkills;
  });
};

const handleSelectArmor = (profileIndex, selectedArmor) => {
  setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];
    selectedProfile.armor = selectedArmor;
    return newSelectedSkills;
  });
};

const handleSelectThrowable = (profileIndex, selectedThrowable) => {
  setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];
    selectedProfile.throwable = selectedThrowable;
    return newSelectedSkills;
  });
};

const handleSelectEquipment = (profileIndex, selectedEquipment) => {
  setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];
    selectedProfile.equipment = selectedEquipment;
    return newSelectedSkills;
  });
};

const handleSelectMelee = (profileIndex, selectedMelee) => {
  setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];
    selectedProfile.melee = selectedMelee;
    return newSelectedSkills;
  });
};




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

  // State to toggle the visibility of the button container
const [buttonContainerVisible, setButtonContainerVisible] = useState(false);

// Function to toggle the visibility of the button container
const toggleButtonContainerVisibility = () => {
  setButtonContainerVisible((prevVisible) => !prevVisible);
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
        // alert('Selected skills imported successfully!');
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

// Constants for sprite image and skill icon dimensions
const ICON_WIDTH = 50; // Width of each individual skill icon in pixels
const ICON_HEIGHT = 50; // Height of each individual skill icon in pixels
const TOTAL_WIDTH = 1040; // Total width of the sprite image in pixels
const TOTAL_HEIGHT = 960; // Total height of the sprite image in pixels

        return (
<div className="container">
          
          <div className="totalSkillPointsDIV">
            <div className="totalSkillPoints">
              <span>Rem. SP</span>
              <br />
              <span>{120-totalSkillPoints}</span>
            </div>
          </div>

<div className="buttonContainer">
  {/* Button to toggle the visibility of the container */}
  <Button onClick={toggleButtonContainerVisibility}>Toggle Buttons</Button>
  {/* The container will only be visible when buttonContainerVisible is true */}
  {buttonContainerVisible && (
    <div className="container">
      <div className="buttons">
      <Button onClick={exportSelectedSkills}>Export Profiles</Button>
      <UploadButton handleFileChange={handleFileChange}/>
      </div>
      <div className="buttons">
      <Button onClick={handleResetSkills}>Reset All Profiles</Button>
      <Button onClick={handleResetProfile}>Reset Profile {currentProfile}</Button>
      </div>
    </div>
  )}
</div>

          <div className="container">
          <Form.Group>
        <Form.Control as="select" value={currentProfile} onChange={(e) => setCurrentProfile(Number(e.target.value))}>
          {Array.from({ length: 15 }, (_, index) => index + 1).map((profileNumber) => (
            <option key={profileNumber} value={profileNumber}>
              Profile {profileNumber}
            </option>
          ))}
        </Form.Control>
        </Form.Group>
        </div>

{/* PRIMARY WEAPON START*/}
<div className="tree">
        <h4 onClick={() => toggleCategoryVisibility('primaryWeapon')} className="categoryName">Primary Weapon</h4>
        {categoryVisibility['primaryWeapon'] && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.primaryWeapon?.subcategory || ''}
          onChange={(e) => {
            const subcategoryName = e.target.value;
            handleSelectPrimaryWeapon(currentProfile - 1, subcategoryName, '');
          }}
          className="tree"
        >
          <option value="">Select Subcategory</option>
          {primaryWeapons.subcategories.map((subcategory) => (
            <option key={subcategory.name} value={subcategory.name}>
              {subcategory.name}
            </option>
          ))}
        </Form.Control>
        )}

        {selectedSkills[currentProfile - 1]?.primaryWeapon?.subcategory && categoryVisibility['primaryWeapon'] && (
          <Form.Control as="select"
            value={selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon || ''}
            onChange={(e) => {
              const weaponName = e.target.value;
              handleSelectPrimaryWeapon(currentProfile - 1, selectedSkills[currentProfile - 1]?.primaryWeapon?.subcategory, weaponName);
            }}
          >
            <option value="">Select Weapon</option>
            {primaryWeapons.subcategories
              .find((subcategory) => subcategory.name === selectedSkills[currentProfile - 1]?.primaryWeapon?.subcategory)
              ?.weapons.map((weapon) => (
                <option key={weapon} value={weapon}>
                  {weapon}
                </option>
              ))}
          </Form.Control>
        )}
      </div>
      {/* PRIMARY WEAPON END*/}

{/* SECONDARY WEAPON START*/}
<div className="tree">
<h4 onClick={() => toggleCategoryVisibility('secondaryWeapon')} className="categoryName">Secondary Weapon</h4>
        {categoryVisibility['secondaryWeapon'] && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.secondaryWeapon?.subcategory || ''}
          onChange={(e) => {
            const subcategoryName = e.target.value;
            handleSelectSecondaryWeapon(currentProfile - 1, subcategoryName, '');
          }}
          className="tree"
        >
          <option value="">Select Subcategory</option>
          {secondaryWeapons.subcategories.map((subcategory) => (
            <option key={subcategory.name} value={subcategory.name}>
              {subcategory.name}
            </option>
          ))}
        </Form.Control>
        )}

        {selectedSkills[currentProfile - 1]?.secondaryWeapon?.subcategory && categoryVisibility['secondaryWeapon'] && (
          <Form.Control as="select"
            value={selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon || ''}
            onChange={(e) => {
              const weaponName = e.target.value;
              handleSelectSecondaryWeapon(currentProfile - 1, selectedSkills[currentProfile - 1]?.secondaryWeapon?.subcategory, weaponName);
            }}
          >
            <option value="">Select Weapon</option>
            {secondaryWeapons.subcategories
              .find((subcategory) => subcategory.name === selectedSkills[currentProfile - 1]?.secondaryWeapon?.subcategory)
              ?.weapons.map((weapon) => (
                <option key={weapon} value={weapon}>
                  {weapon}
                </option>
              ))}
          </Form.Control>
        )}
      </div>
{/* SECONDARY WEAPON END */}

{/* PERK DECK START */}
<div className="tree">
<h4 onClick={() => toggleCategoryVisibility('perkDeck')} className="categoryName">Perk Deck</h4>
        {categoryVisibility['perkDeck'] && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.perkDeck || ''}
          onChange={(e) => {
            const selectedPerkDeck = e.target.value;
            handleSelectPerkDeck(currentProfile - 1, selectedPerkDeck);
          }}
          className="tree"
        >
          <option value="">Select Perk Deck</option>
          {perkDecks.map((perkDeck) => (
            <option key={perkDeck} value={perkDeck}>
              {perkDeck}
            </option>
          ))}
        </Form.Control>
        )}
      </div>
{/* PERK DECK END */}

{/* ARMOR START */}
<div className="tree">
<h4 onClick={() => toggleCategoryVisibility('armor')} className="categoryName">Armor</h4>
        {categoryVisibility['armor'] && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.armor || ''}
          onChange={(e) => {
            const selectedArmor = e.target.value;
            handleSelectArmor(currentProfile - 1, selectedArmor);
          }}
          className="tree"
        >
          <option value="">Select Armor</option>
          {armors.map((armor) => (
            <option key={armor} value={armor}>
              {armor}
            </option>
          ))}
        </Form.Control>
        )}
      </div>
{/* ARMOR END */}

{/* THROWABLES START */}
<div className="tree">
<h4 onClick={() => toggleCategoryVisibility('throwable')} className="categoryName">Throwable</h4>
        {categoryVisibility['throwable'] && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.throwable || ''}
          onChange={(e) => {
            const selectedThrowable = e.target.value;
            handleSelectThrowable(currentProfile - 1, selectedThrowable);
          }}
          className="tree"
        >
          <option value="">Select Throwable</option>
          {throwables.map((throwable) => (
            <option key={throwable} value={throwable}>
              {throwable}
            </option>
          ))}
        </Form.Control>
        )}
      </div>
{/* THROWABLES END */}

{/* EQUIMPENTS START */}
<div className="tree">
<h4 onClick={() => toggleCategoryVisibility('equipment')} className="categoryName">Equipment</h4>
        {categoryVisibility['equipment'] && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.equipment || ''}
          onChange={(e) => {
            const selectedEquipment = e.target.value;
            handleSelectEquipment(currentProfile - 1, selectedEquipment);
          }}
          className="tree"
        >
          <option value="">Select Equipment</option>
          {equipments.map((equipment) => (
            <option key={equipment} value={equipment}>
              {equipment}
            </option>
          ))}
        </Form.Control>
        )}
      </div>
{/* EQUIMPENTS END */}

{/* MELEES START */}
<div className="tree">
<h4 onClick={() => toggleCategoryVisibility('melee')} className="categoryName">Melee</h4>
        {categoryVisibility['melee'] && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.melee || ''}
          onChange={(e) => {
            const selectedMelees = e.target.value;
            handleSelectMelee(currentProfile - 1, selectedMelees);
          }}
          className="tree"
        >
          <option value="">Select Melees</option>
          {melees.map((melee) => (
            <option key={melee} value={melee}>
              {melee}
            </option>
          ))}
        </Form.Control>
        )}
      </div>
{/* MELEES END */}

{/* SKILLS START */}
<div className="tree">
          <h4 onClick={() => toggleCategoryVisibility('skill')} className="categoryName">Skills</h4>
          {categoryVisibility['skill'] && (
            <>
          {Object.entries(sortedOrganizedSkills).map(([treeName, subtrees]) => (
            <div key={treeName} className="tree">
              <h2 className="treeName" onClick={() => toggleCategoryVisibility(treeName)}>{treeName.toUpperCase()} ({treeSubtotals[treeName]})</h2>
              {categoryVisibility[treeName] && (
            <React.Fragment>
              {Object.entries(subtrees).map(([subtreeName, skills]) => {
                const tiers = [1, 2, 3, 4].reverse(); // Inverted tiers
                return (
                  <div key={subtreeName} className="subtree">
                    
                    {tiers.map((tier) => {
                      const tierSkills = skills.filter((skill) => skill.tier === tier);
    
                      return (
                        <Row key={tier}>
                          {tierSkills.map((skill) => (
                            <Col key={skill.name} className="skillCol">

                               <Button
                onClick={() => handleSkillSelect(skill.name)}
                className={
                                  'skillButton ' +
                                  (selectedSkills[currentProfile - 1][skill.name] === 'basic'
                                    ? 'basicButton'
                                    : selectedSkills[currentProfile - 1][skill.name] === 'ace'
                                    ? 'aceButton'
                                    : 'unselectedButton')
                                }  
                                title={skill.description}
                style={{
                  backgroundImage: selectedSkills[currentProfile - 1][skill.name] === 'basic'
                    ? `url(${iconSkills})`
                    : selectedSkills[currentProfile - 1][skill.name] === 'ace'
                    ? `url(${iconSkills})`
                    : `url(${lockSkill})`,
                  backgroundPosition:
                  selectedSkills[currentProfile - 1][skill.name] === 'basic' || selectedSkills[currentProfile - 1][skill.name] === 'ace'
                  ? `-${skill.idWidth}px -${skill.idHeight}px`
                  // ? `-720px -400px`
                  : 'center',
                  backgroundSize:
                  selectedSkills[currentProfile - 1][skill.name] === 'basic' || selectedSkills[currentProfile - 1][skill.name] === 'ace'
                  // ? `${TOTAL_WIDTH}px ${TOTAL_HEIGHT}px`
                  ? `960px 1040px`
                  : '80px',
                  backgroundRepeat: 'no-repeat',
                  overflow: 'visible',
                }}
              >
        {selectedSkills[currentProfile - 1][skill.name] === 'basic' ? ' ' : ' '}
  {selectedSkills[currentProfile - 1][skill.name] === 'ace' && (
    <img
      src={aceImage}
      alt=""
      style={{ width: '80px', height: '80px', position: 'absolute', transform: 'translate(-55%, -35%)'}}
    />
  )}
              </Button>
                              {/* <Button
                                onClick={() => handleSkillSelect(skill.name)}
                                className={
                                  'skillButton ' +
                                  (selectedSkills[currentProfile - 1][skill.name] === 'basic'
                                    ? 'basicButton'
                                    : selectedSkills[currentProfile - 1][skill.name] === 'ace'
                                    ? 'aceButton'
                                    : 'unselectedButton')
                                }  
                                title={skill.description}
                                style={{
                                  backgroundImage:
                                    selectedSkills[currentProfile - 1][skill.name] === 'basic'
                                      ? `url(${basicImage})`
                                      : selectedSkills[currentProfile - 1][skill.name] === 'ace'
                                      ? `url(${aceImage})`
                                      : `url(${lockSkill})`,
                                  backgroundSize: '50px',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'center',
                                  overflow: 'visible',
                                }}
                              >
                                {selectedSkills[currentProfile - 1][skill.name] === 'basic'
                                  ? ' '
                                  : selectedSkills[currentProfile - 1][skill.name] === 'ace'
                                  ? ' '
                                  : ' '}
                              </Button> */}
                              <div>
                                <span
                                  style={{
                                    fontWeight:
                                      selectedSkills[currentProfile - 1][skill.name] === 'basic' || selectedSkills[currentProfile - 1][skill.name] === 'ace'
                                        ? 'bold'
                                        : '',
                                    color:
                                      selectedSkills[currentProfile - 1][skill.name] === 'basic'
                                        ? 'white'
                                        : selectedSkills[currentProfile - 1][skill.name] === 'ace'
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
                    <h3 className="subtreeName">{subtreeName.toUpperCase()}</h3>
                  </div>

                );
              })}
              </React.Fragment>
          )}
            </div>
          ))}
          </>
          )}
  </div>
{/* SKILLS END */}

          <Button className="buttonGoToTop" onClick={() => goToTop()}>Go to top</Button>
        </div>
      );
  };
  
  export default Builder;
  