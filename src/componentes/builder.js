import React, { useState, useRef, useEffect, useContext } from 'react';
import { BiExport, BiImport } from "react-icons/bi";
import skillsData from '../database/skills.json';
import primaryWeapons from '../database/primary.json';
import secondaryWeapons from '../database/secondary.json';
import weaponMods from '../database/weaponMods.json'
import { modCategoryNames } from '../database/modCategoryNames';
import { subtreeNames } from '../database/subtreeNames';
import perkDecks from '../database/perkDecks.json';
import armors from '../database/armors.json';
import throwables from '../database/throwables.json';
import equipments from '../database/equipments.json';
import melees from '../database/melees.json';
// import tagsRaw from '../database/tags.json'
import {Button, Row, Col, Container, ListGroup, Table, Form, Carousel, Dropdown, DropdownButton, NavItem, NavLink, ButtonGroup, Nav, Tab, Tabs } from 'react-bootstrap';
import aceImage from '../imagenes/ace.png';
import lockSkill from '../imagenes/padlock.png'
import iconSkills from '../imagenes/icons.png'
import { itemsToImage } from "../database/itemsToImage";
import { IoPricetags, IoPricetagsOutline } from "react-icons/io5";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { GoChevronRight } from "react-icons/go";
import Context from "../context";
import { supabase } from '../supabaseClient';
import { fetchData } from './DataService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';




const Builder = () => {
  const context= useContext(Context)  

  
  const [tagsRaw, setTagsRaw] = useState([]);
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const { tagsRawOnline } = await fetchData();
        setTagsRaw(tagsRawOnline);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchDataFromAPI();
  }, []);
  
  const tags = tagsRaw.sort()
  
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
    equipment1: null, // Add this property for secondary equipment
    equipment2: null, // Add this property for primary equipment
    }));
  };
  
  const selectedSkills = context.selectedSkills
  // const [selectedSkills, setSelectedSkills] = useState(() => {
  //   return loadSelectedSkillsFromLocalStorage();
  // });
  
  useEffect(() => {
    saveSelectedSkillsToLocalStorage(selectedSkills);
    context.setSelectedSkills(selectedSkills)
  }, [context.selectedSkills, selectedSkills]);

  const handleResetSkills = () => {
    const confirmed = window.confirm(`Are you sure you want to reset all profiles? This will clear all skills and categories.`);
  if (confirmed) {
    context.setSelectedSkills(Array.from({ length: 15 }, () => ({})));
    localStorage.removeItem('selectedSkills');
  }
  };

 const handleResetProfile = () => {
    const confirmed = window.confirm(`Are you sure you want to reset Profile ${currentProfile}? This will clear all selected skills and categories.`);
  if (confirmed) {
    context.setSelectedSkills((prevSelectedSkills) => {
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
      context.setSelectedSkills((prevSelectedSkills) => {
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
  
const calculateSubtreePoints = (subtree) => {
  let totalPoints = 0;

  subtree.forEach((skill) => {
    const skillState = selectedSkills[currentProfile - 1][skill.name];

    if (skillState === 'basic') {
      totalPoints += skill.basic; // Add basic points
    } else if (skillState === 'ace') {
      totalPoints += skill.basic + skill.ace; // Add both basic and ace points
    }
  });

  return totalPoints;
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
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    selectedProfile.primaryWeapon = { subcategory: subcategoryName, weapon: weaponName };

    return newSelectedSkills;
  });
};

const handleSelectSecondaryWeapon = (profileIndex, subcategoryName, weaponName) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    selectedProfile.secondaryWeapon = { subcategory: subcategoryName, weapon: weaponName };

    return newSelectedSkills;
  });
};

const handleSelectPrimaryWeaponMod = (profileIndex, modCategory, modValue) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Initialize mods if not already set
    selectedProfile.primaryWeapon.mods = selectedProfile.primaryWeapon.mods || {};

    // Check if the mod is already selected
    const currentModValue = selectedProfile.primaryWeapon.mods[modCategory];

    if (currentModValue) {
      if (currentModValue === modValue) {
        // If the selected mod is the same as the current, remove the mod category
        delete selectedProfile.primaryWeapon.mods[modCategory];
      } else {
        // If a different mod is selected, update the mod category
        selectedProfile.primaryWeapon.mods[modCategory] = modValue;
      }
    } else {
      // If no mod is selected for this category, add the new mod
      selectedProfile.primaryWeapon.mods[modCategory] = modValue;
    }
    
    // Dynamically get the order of mod categories from weaponMods.json
    const modCategoriesOrder = Object.keys(weaponMods.weaponMods);
    // Create a sorted mods object based on the dynamic modCategoriesOrder
    const sortedMods = {};
    modCategoriesOrder.forEach((category) => {
      if (selectedProfile.primaryWeapon.mods[category]) {
        sortedMods[category] = selectedProfile.primaryWeapon.mods[category];
      }
    });

    // Assign the sorted mods back to the selected profile
    selectedProfile.primaryWeapon.mods = sortedMods;

    return newSelectedSkills;
  });
};

const handleSelectSecondaryWeaponMod = (profileIndex, modCategory, modValue) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Initialize mods if not already set
    selectedProfile.secondaryWeapon.mods = selectedProfile.secondaryWeapon.mods || {};

    // Check if the mod is already selected
    const currentModValue = selectedProfile.secondaryWeapon.mods[modCategory];

    if (currentModValue) {
      if (currentModValue === modValue) {
        // If the selected mod is the same as the current, remove the mod category
        delete selectedProfile.secondaryWeapon.mods[modCategory];
      } else {
        // If a different mod is selected, update the mod category
        selectedProfile.secondaryWeapon.mods[modCategory] = modValue;
      }
    } else {
      // If no mod is selected for this category, add the new mod
      selectedProfile.secondaryWeapon.mods[modCategory] = modValue;
    }

    // Dynamically get the order of mod categories from weaponMods.json
    const modCategoriesOrder = Object.keys(weaponMods.weaponMods);
    // Create a sorted mods object based on the dynamic modCategoriesOrder
    const sortedMods = {};
    modCategoriesOrder.forEach((category) => {
      if (selectedProfile.secondaryWeapon.mods[category]) {
        sortedMods[category] = selectedProfile.secondaryWeapon.mods[category];
      }
    });

    // Assign the sorted mods back to the selected profile
    selectedProfile.secondaryWeapon.mods = sortedMods;

    return newSelectedSkills;
  });
};


const handleSelectPerkDeck = (profileIndex, selectedPerkDeck) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Update the selected perk deck for the selected profile
    selectedProfile.perkDeck = selectedPerkDeck;

    return newSelectedSkills;
  });
};

const handleSelectArmor = (profileIndex, selectedArmor) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];
    selectedProfile.armor = selectedArmor;
    return newSelectedSkills;
  });
};

const handleSelectThrowable = (profileIndex, selectedThrowable) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];
    selectedProfile.throwable = selectedThrowable;
    return newSelectedSkills;
  });
};

// const handleSelectEquipment = (profileIndex, selectedEquipment) => {
//   setSelectedSkills((prevSelectedSkills) => {
//     const newSelectedSkills = [...prevSelectedSkills];
//     const selectedProfile = newSelectedSkills[profileIndex];
//     selectedProfile.equipment = selectedEquipment;
//     return newSelectedSkills;
//   });
// };

const handleSelectEquipment = (profileIndex, selectedEquipment) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Check if the skill "Jack of All Trades" has an "ace" value for this profile
    const hasJackOfAllTradesAce = selectedProfile["Jack of All Trades"] === "ace";

    if (hasJackOfAllTradesAce) {
      // If "Jack of All Trades" has an "ace" value, allow selection of both primary and secondary equipment
      selectedProfile.equipment1 = selectedEquipment.primary;
      selectedProfile.equipment2 = selectedEquipment.secondary;
      selectedProfile.equipment = `${selectedProfile.equipment1}, ${selectedProfile.equipment2}`;
    } else {
      // If "Jack of All Trades" does not have an "ace" value, only allow selection of a single equipment
      selectedProfile.equipment1 = selectedEquipment.primary;
      selectedProfile.equipment2 = null;
      selectedProfile.equipment = selectedEquipment.primary;
    }

    return newSelectedSkills;
  });
};


const handleSelectMelee = (profileIndex, selectedMelee) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];
    selectedProfile.melee = selectedMelee;
    return newSelectedSkills;
  });
};


const handleSelectTags = (profileIndex, selectedTag, isChecked) => {
  context.setSelectedSkills((prevSelectedSkills) => {
    const newSelectedSkills = [...prevSelectedSkills];
    const selectedProfile = newSelectedSkills[profileIndex];

    // Ensure selectedProfile.tags is always an array
    if (!Array.isArray(selectedProfile.tags)) {
      selectedProfile.tags = selectedProfile.tags ? [selectedProfile.tags] : [];
    }

    if (isChecked) {
      // Add the tag if it's not already in the array
      if (!selectedProfile.tags.includes(selectedTag)) {
        selectedProfile.tags.push(selectedTag);
      }
    } else {
      // Remove the tag if it's unchecked
      selectedProfile.tags = selectedProfile.tags.filter(tag => tag !== selectedTag);
    }

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

  const [expandedTreeSkills, setExpandedTreeSkills] = useState(null);
  const toggleTreeSkills = (index) => {
    setExpandedTreeSkills(prevIndex => prevIndex === index ? null : index);
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
      <>
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
        <Button
          onClick={handleImport}
          className="mainButtons"
          // <Button onClick={handleResetSkills} variant="danger" className="mainButtons">Reset All Profiles</Button>
          // className={`btn btn-outline-${uploadedFileName ? 'success' : 'primary'}`}
        ><BiImport size={20} style={{ marginRight: '8px' }} />
          {uploadedFileName ? uploadedFileName : 'Import Profiles'}
        </Button>
      </>
    );
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedSkills = JSON.parse(e.target.result);
        context.setSelectedSkills(importedSkills);
        // alert('Selected skills imported successfully!');
      } catch (error) {
        alert('Error importing selected skills.');
      }
    };

    reader.readAsText(file);
  };  

  const [isTagsActive, setIsTagsActive] = useState(false);

  const toggleTagsVisibility = () => {
    setIsTagsActive((prevState) => !prevState);
  };

  const [isSkillPointsVisible, setIsSkillPointsVisible] = useState(false);

  const toggleSkillPointsVisibility = () => {
    setIsSkillPointsVisible(!isSkillPointsVisible);
  };

  const [selectedCategoryPrimary, setSelectedCategoryPrimary] = useState(Object.keys(weaponMods.weaponMods)[0]);
  const [selectedCategorySecondary, setSelectedCategorySecondary] = useState(Object.keys(weaponMods.weaponMods)[0]);
  const [showModsPrimary, setShowModsPrimary] = useState(false); 
  const [showModsSecondary, setShowModsSecondary] = useState(false); 

  const ModSelectionContainer = ({
    selectedSkills,
    currentProfile,
    primaryWeapon,
    secondaryWeapon,
    handleSelectPrimaryWeaponMod,
    handleSelectSecondaryWeaponMod,
    categoryVisibility,
    weaponMods,
    selectedCategoryPrimary,
    selectedCategorySecondary
  }) => {
    const [filter, setFilter] = useState('');
    const isPrimaryWeapon = primaryWeapon && categoryVisibility['primaryWeapon'];
    
    const toggleModVisibilityPrimary = () => {
      setShowModsPrimary((prev) => !prev);
    };
    const toggleModVisibilitySecondary = () => {
      setShowModsSecondary((prev) => !prev);
    };
  
    const excludedCategories = ["bayonet"];

    const allMods = Object.keys(weaponMods.weaponMods).flatMap(
      (category) => weaponMods.weaponMods[category]
    );
  
    const modsFromSelectedCategoryPrimary = weaponMods.weaponMods[selectedCategoryPrimary];
    const modsFromSelectedCategorySecondary = weaponMods.weaponMods[selectedCategorySecondary];

    return (
      <div className="container-mod">
      
      {isPrimaryWeapon ? (<>
      
      <div
      className={`toggle-button-mods ${showModsPrimary ? "active" : ""}`}
      onClick={toggleModVisibilityPrimary}>
      {showModsPrimary ? (<>
        <p>EDIT MODS</p>
        <IoEyeOff />
        <p>HIDE</p>
      </>):(<>
        <p>EDIT MODS</p>
        <IoEye />
        <p>SHOW</p>
      </>)}
      </div>

      {showModsPrimary &&
      <Tabs activeKey={selectedCategoryPrimary} onSelect={(modCategory) => {
          setSelectedCategoryPrimary(modCategory);
          setShowModsPrimary(true);
      }} className="mod-category-tabs">
          {Object.keys(weaponMods.weaponMods)
            .filter(modCategory => isPrimaryWeapon && primaryWeapon === "Nagant Sniper Rifle" ? true : !excludedCategories.includes(modCategory))
            .map((modCategory) => (
              <Tab
              key={modCategory}
              eventKey={modCategory}
              title={modCategoryNames[modCategory] || modCategory}
            />
            ))}
      </Tabs>
      }

{/* DROPDOWN COMPONENT FOR MODS PRIMARY */}

      </>) : (<>
      <div
      className={`toggle-button-mods ${showModsSecondary ? "active" : ""}`}
      onClick={toggleModVisibilitySecondary}>
      {showModsSecondary ? (<>
        <p>EDIT MODS</p>
        <IoEyeOff />
        <p>HIDE</p>
      </>):(<>
        <p>EDIT MODS</p>
        <IoEye />
        <p>SHOW</p>
      </>)}
      </div>

      {showModsSecondary &&
      <Tabs activeKey={selectedCategorySecondary} onSelect={(modCategory) => {
      setSelectedCategorySecondary(modCategory);
      setShowModsSecondary(true);
      }}
      className="mod-category-tabs">
      {Object.keys(weaponMods.weaponMods)
        .filter(modCategory => !excludedCategories.includes(modCategory))
        .map((modCategory) => (            
            <Tab
            key={modCategory}
            eventKey={modCategory}
            title={modCategoryNames[modCategory] || modCategory}
            />
        ))}
      </Tabs>
      }
    </>)}
        {showModsPrimary && (
        <div>
          {isPrimaryWeapon && selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon && (
            <ModSelectionComponent
              modCategory={selectedCategoryPrimary}
              mods={modsFromSelectedCategoryPrimary}
              allMods={allMods}
              selectedMod={selectedSkills[currentProfile - 1]?.primaryWeapon?.mods?.[selectedCategoryPrimary] || ''}
              onSelectMod={(modValue) => handleSelectPrimaryWeaponMod(currentProfile - 1, selectedCategoryPrimary, modValue)}
              filter={filter}
              setFilter={setFilter}
            />
          )}
          </div>
        )}
        {showModsSecondary && (
        <div>
          {secondaryWeapon && categoryVisibility['secondaryWeapon'] && selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon && (
            <ModSelectionComponent
              modCategory={selectedCategorySecondary}
              mods={modsFromSelectedCategorySecondary}
              allMods={allMods}
              selectedMod={selectedSkills[currentProfile - 1]?.secondaryWeapon?.mods?.[selectedCategorySecondary] || ''}
              onSelectMod={(modValue) => handleSelectSecondaryWeaponMod(currentProfile - 1, selectedCategorySecondary, modValue)}
              filter={filter}
              setFilter={setFilter}
            />
          )}
        </div>
        )}
    </div>
  );
};
  
  const ModSelectionComponent = ({ mods, allMods, selectedMod, onSelectMod, filter, setFilter }) => {

    // If filter is active, search all mods. If no filter, show only the mods from the selected category
      const filteredMods = filter
      ? allMods.filter((mod) => mod.toLowerCase().includes(filter.toLowerCase()))
      : mods;
  
    return (
      <div className="mod-selection-container">
        <input
          type="text"
          placeholder="Search mods..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mod-filter-input"
        />
        <div className="mod-items-grid">
          {filteredMods.map((mod) => (
            <div
              key={mod}
              className={`mod-item ${selectedMod === mod ? 'selected' : ''}`}
              onClick={() => onSelectMod(mod)}
            >
              <img src={itemsToImage[mod]} alt={mod} />
              <p>{mod}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };


  // State to toggle visibility of the select profile below the Carousel
  const [showSelect, setShowSelect] = useState(false);
  
  // Toggle the select dropdown visibility when clicking on the profile name
  const handleProfileNameClick = () => {
    // setShowSelect(true); // Show the select dropdown when profile name is clicked
    setShowSelect((prevState) => !prevState); // Toggle the state
  };


  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3; // Total number of slides

  function goToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

console.log(context.selectedSkills)
        return ( // return part

<div className="backgroundColor builder">
    <div className="component-title">BUILD / EDIT</div>

<Container style={{paddingTop: 0}}>
          
    <div
      className={`toggle-button-skill-points ${isSkillPointsVisible ? "active" : ""}`}
      onClick={toggleSkillPointsVisibility} // Handle click to toggle visibility
      >
      {isSkillPointsVisible ? <IoEyeOff /> : <IoEye />}
    </div>
      <div className={`totalSkillPointsDIV ${!isSkillPointsVisible && "hidden"}`}>
        <div className="totalSkillPoints">
          <span>Rem. SP</span>
          <br />
          <span>{120-totalSkillPoints}</span>
        </div>
      </div>

<Container className="carousel-container">
  <Carousel
    activeIndex={currentProfile - 1} // Set the currently active index (0-based)
    onSelect={(selectedIndex) => setCurrentProfile(selectedIndex + 1)} // Update the currentProfile on select
    controls={true}
    indicators={false}
    interval={null}
    className="carousel-profile"
  >
    {Array.from({ length: 15 }, (_, index) => index + 1).map((profileNumber) => (
      <Carousel.Item key={profileNumber}>
        <div className="carousel-content">
          <div onClick={handleProfileNameClick}>Profile {profileNumber}</div>
        </div>
      </Carousel.Item>
    ))}
  </Carousel>

{showSelect && (
  <Dropdown as={NavItem} className="selectProfile">
    <Dropdown.Toggle as={NavLink} className="selectProfileText">
      Select Profile
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {Array.from({ length: 15 }, (_, index) => index + 1).map((profileNumber) => (
        <Dropdown.Item
          key={profileNumber}
          onClick={() => {
            setCurrentProfile(profileNumber);
            setShowSelect(false); // Close the dropdown after selecting a profile
          }}
          className={`${profileNumber === currentProfile ? "selectedCategory" : ""}`}
        >
          Profile {profileNumber}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
)}

</Container>


        <div>
{/* PRIMARY WEAPON START*/}
<Form className="grid-form-builder">
        <Form.Label onClick={() => toggleCategoryVisibility('primaryWeapon')} className="categoryName">
        PRIMARY WEAPON</Form.Label>
        {categoryVisibility['primaryWeapon'] && !selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon && (
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.primaryWeapon?.subcategory || ''}
          onChange={(e) => {
            const subcategoryName = e.target.value;
            handleSelectPrimaryWeapon(currentProfile - 1, subcategoryName, '');
          }}
          className="primarySecondayWeapon"
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
            className="tree"
          >
            <option value="">Select Weapon</option>
            {primaryWeapons.subcategories
  .find((subcategory) => subcategory.name === selectedSkills[currentProfile - 1]?.primaryWeapon?.subcategory)
  ?.weapons.map((weapon) => {
    const normalizedWeapon = weapon.replace(/\s?\([^)]+\)/, '').trim();
    return (
      <option key={normalizedWeapon} value={normalizedWeapon}>
        {normalizedWeapon}
      </option>
    );
  })}
        </Form.Control>
        )}
<div className="grid-container builder">
{selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon && categoryVisibility['primaryWeapon'] && (
    (() => {
      const subcategory = primaryWeapons.subcategories
        .find((subcategory) => subcategory.name === selectedSkills[currentProfile - 1]?.primaryWeapon?.subcategory);
      // Find the full weapon name from primaryGuns where the trimmed version matches selectedSkills
      const selectedWeapon = selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon;
      const matchedWeapon = subcategory?.weapons.find((weapon) => {
        const trimmedWeapon = weapon.replace(/\s?\([^)]+\)/, '').trim(); // Trim parentheses from primaryGuns weapon
        return trimmedWeapon === selectedWeapon; // Match it to the selectedSkills weapon
      });
      return matchedWeapon ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matchedWeapon]}
          alt={matchedWeapon}
          className="grid-image builder"
        />
        </div>
      ) : null;
    })()
  )}
  </div>

      {/* Render Mod Images Below Weapon */}
      {selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon && selectedSkills[currentProfile - 1]?.primaryWeapon?.mods && categoryVisibility['primaryWeapon'] && (
      <div className="mods-container">
        {Object.entries(selectedSkills[currentProfile - 1].primaryWeapon.mods).map(([modCategory, modName]) => {
          const modImage = itemsToImage[modName];
          return modImage ? (
            <div key={modCategory} className="mod-item-showcase">
              <div className="mod-category">{modCategoryNames[modCategory]}</div>
              <img
                src={modImage}
                alt={modName}
                className="mod-image"
              />
              <div className="mod-label">{modName}</div>
            </div>
          ) : null;
        })}
      </div>
    )}
  
</Form>
{/* PRIMARY WEAPON END*/}

{/* PRIMARY WEAPON MOD SELECTION START */}
    {selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon && categoryVisibility['primaryWeapon'] && (
      <ModSelectionContainer
        selectedSkills={selectedSkills}
        currentProfile={currentProfile}
        primaryWeapon={selectedSkills[currentProfile - 1]?.primaryWeapon?.weapon}
        handleSelectPrimaryWeaponMod={handleSelectPrimaryWeaponMod}
        categoryVisibility={categoryVisibility}
        weaponMods={weaponMods}
        selectedCategoryPrimary={selectedCategoryPrimary}
      />
    )}
{/* PRIMARY WEAPON MOD SELECTION END */}

{categoryVisibility['primaryWeapon'] &&
<div className="separatorBuilder"></div>
}

{/* SECONDARY WEAPON START*/}
<Form className="grid-form-builder">
        <Form.Label onClick={() => toggleCategoryVisibility('secondaryWeapon')} className="categoryName">
        SECONDARY WEAPON</Form.Label>
        {categoryVisibility['secondaryWeapon'] && !selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon &&(
        <Form.Control as="select"
          value={selectedSkills[currentProfile - 1]?.secondaryWeapon?.subcategory || ''}
          onChange={(e) => {
            const subcategoryName = e.target.value;
            handleSelectSecondaryWeapon(currentProfile - 1, subcategoryName, '');
          }}
          className="primarySecondayWeapon"
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
            className="tree"
          >
            <option value="">Select Weapon</option>
            {secondaryWeapons.subcategories
  .find((subcategory) => subcategory.name === selectedSkills[currentProfile - 1]?.secondaryWeapon?.subcategory)
  ?.weapons.map((weapon) => {
    const normalizedWeapon = weapon.replace(/\s?\([^)]+\)/, '').trim();
    return (
      <option key={normalizedWeapon} value={normalizedWeapon}>
        {normalizedWeapon}
      </option>
    );
  })}
        </Form.Control>
        )}
<div className="grid-container builder">
{selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon && categoryVisibility['secondaryWeapon'] && (
    (() => {
      const subcategory = secondaryWeapons.subcategories
        .find((subcategory) => subcategory.name === selectedSkills[currentProfile - 1]?.secondaryWeapon?.subcategory);
      // Find the full weapon name from secondaryGuns where the trimmed version matches selectedSkills
      const selectedWeapon = selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon;
      const matchedWeapon = subcategory?.weapons.find((weapon) => {
        const trimmedWeapon = weapon.replace(/\s?\([^)]+\)/, '').trim(); // Trim parentheses from secondaryGuns weapon
        return trimmedWeapon === selectedWeapon; // Match it to the selectedSkills weapon
      });
      return matchedWeapon ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matchedWeapon]}
          alt={matchedWeapon}
          className="grid-image selected builder"
        />
        </div>
      ) : null;
    })()
  )}
</div>  

      {/* Render Mod Images Below Weapon */}
      {selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon && selectedSkills[currentProfile - 1]?.secondaryWeapon?.mods && categoryVisibility['secondaryWeapon'] && (
      <div className="mods-container">
        {Object.entries(selectedSkills[currentProfile - 1].secondaryWeapon.mods).map(([modCategory, modName]) => {
          const modImage = itemsToImage[modName];
          return modImage ? (
            <div key={modCategory} className="mod-item-showcase">
              <div className="mod-category">{modCategoryNames[modCategory]}</div>
              <img
                src={modImage}
                alt={modName}
                className="mod-image"
              />
              <div className="mod-label">{modName}</div>
            </div>
          ) : null;
        })}
      </div>
    )}
</Form>
{/* SECONDARY WEAPON END */}

{/* SECONDARY WEAPON MOD SELECTION START */}
 {selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon && categoryVisibility['secondaryWeapon'] && (
      <ModSelectionContainer
        selectedSkills={selectedSkills}
        currentProfile={currentProfile}
        secondaryWeapon={selectedSkills[currentProfile - 1]?.secondaryWeapon?.weapon}
        handleSelectSecondaryWeaponMod={handleSelectSecondaryWeaponMod}
        categoryVisibility={categoryVisibility}
        weaponMods={weaponMods}
        selectedCategorySecondary={selectedCategorySecondary}
      />
    )}
{/* SECONDARY WEAPON MOD SELECTION END */}

{categoryVisibility['secondaryWeapon'] &&
<div className="separatorBuilder"></div>
}

{/* PERK DECK START */}
{/* <Form>
<Form.Label onClick={() => toggleCategoryVisibility('perkDeck')} className="categoryName">PERK DECK</Form.Label>
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
      </Form> */}
 <Form className="grid-form-builder">
  <Form.Label onClick={() => toggleCategoryVisibility('perkDeck')} className="categoryName">PERK DECK</Form.Label>
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
      {perkDecks.map((perkDeck) => {
        // Normalize the perk deck name for display (remove parentheses or unwanted characters)
        const normalizedPerkDeck = perkDeck.replace(/\s?\([^)]+\)/, '').trim();
        return (
          <option key={normalizedPerkDeck} value={normalizedPerkDeck}>
            {normalizedPerkDeck}
          </option>
        );
      })}
    </Form.Control>
  )}
<div className="grid-container builder">
  {/* Rendering the image */}
  {selectedSkills[currentProfile - 1]?.perkDeck && categoryVisibility['perkDeck'] && (
    (() => {
      const selectedPerkDeck = selectedSkills[currentProfile - 1]?.perkDeck;

      // Find the full perk deck name from perkDecks where the trimmed version matches selectedSkills
      const matchedPerkDeck = perkDecks.find((perkDeck) => {
        const trimmedPerkDeck = perkDeck.replace(/\s?\([^)]+\)/, '').trim(); // Trim parentheses from perkDecks name
        return trimmedPerkDeck === selectedPerkDeck; // Match it to the selectedSkills perk deck
      });

      return matchedPerkDeck ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matchedPerkDeck]}
          alt={matchedPerkDeck}
          className="grid-image builder perkDeck"
        />
        </div>
      ) : null;
    })()
  )}
  </div>
</Form>
{/* PERK DECK END */}

{/* {categoryVisibility['perkDeck'] &&
<div className="separatorBuilder"></div>
} */}

{/* ARMOR START */}
{/* <Form>
<Form.Label onClick={() => toggleCategoryVisibility('armor')} className="categoryName">ARMOR</Form.Label>
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
      </Form> */}
<Form className="grid-form-builder">
  <Form.Label onClick={() => toggleCategoryVisibility('armor')} className="categoryName">ARMOR</Form.Label>
  {categoryVisibility['armor'] && (
    <Form.Control as="select"
      value={selectedSkills[currentProfile - 1]?.armor || ''}
      onChange={(e) => {
        const selected = e.target.value;
        handleSelectArmor(currentProfile - 1, selected);
      }}
      className="tree"
    >
      <option value="">Select Armor</option>
      {armors.map((armor) => {
        const normalized = armor.replace(/\s?\([^)]+\)/, '').trim();
        return (
          <option key={normalized} value={normalized}>
            {normalized}
          </option>
        );
      })}
    </Form.Control>
  )}
<div className="grid-container builder">
  {/* Rendering the image */}
  {selectedSkills[currentProfile - 1]?.armor && categoryVisibility['armor'] && (
    (() => {
      const selected = selectedSkills[currentProfile - 1]?.armor;

      const matched = armors.find((armor) => {
        const trimmed = armor.replace(/\s?\([^)]+\)/, '').trim();
        return trimmed === selected;
      });

      return matched ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matched]}
          alt={matched}
          className="grid-image builder"
        />
        </div>
      ) : null;
    })()
  )}
  </div>
</Form>
{/* ARMOR END */}

{/* {categoryVisibility['armor'] &&
<div className="separatorBuilder"></div>
} */}

{/* THROWABLES START */}
{/* <Form>
<Form.Label onClick={() => toggleCategoryVisibility('throwable')} className="categoryName">THROWABLE</Form.Label>
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
      </Form> */}
 <Form className="grid-form-builder">
  <Form.Label onClick={() => toggleCategoryVisibility('throwable')} className="categoryName">THROWABLES</Form.Label>
  {categoryVisibility['throwable'] && (
    <Form.Control as="select"
      value={selectedSkills[currentProfile - 1]?.throwable || ''}
      onChange={(e) => {
        const selected = e.target.value;
        handleSelectThrowable(currentProfile - 1, selected);
      }}
      className="tree"
    >
      <option value="">Select Throwable</option>
      {throwables.map((throwable) => {
        const normalized = throwable.replace(/\s?\([^)]+\)/, '').trim();
        return (
          <option key={normalized} value={normalized}>
            {normalized}
          </option>
        );
      })}
    </Form.Control>
  )}
<div className="grid-container builder">
  {/* Rendering the image */}
  {selectedSkills[currentProfile - 1]?.throwable && categoryVisibility['throwable'] && (
    (() => {
      const selected = selectedSkills[currentProfile - 1]?.throwable;

      const matched = throwables.find((throwable) => {
        const trimmed = throwable.replace(/\s?\([^)]+\)/, '').trim();
        return trimmed === selected;
      });

      return matched ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matched]}
          alt={matched}
          className="grid-image builder"
        />
        </div>
      ) : null;
    })()
  )}
  </div>
</Form>
{/* THROWABLES END */}

{/* {categoryVisibility['throwable'] &&
<div className="separatorBuilder"></div>
} */}

{/* EQUIPMENTS START */}
{/* <Form>
  <Form.Label onClick={() => toggleCategoryVisibility('equipment')} className="categoryName">EQUIPMENT</Form.Label>
  {categoryVisibility['equipment'] && (
    <Form.Control
      as="select"
      value={selectedSkills[currentProfile - 1]?.equipment1 || ''}
      onChange={(e) => {
        const selectedPrimaryEquipment = e.target.value;
        handleSelectEquipment(currentProfile - 1, { primary: selectedPrimaryEquipment });
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

  {selectedSkills[currentProfile - 1]?.["Jack of All Trades"] === "ace" && categoryVisibility['equipment'] && (
    <Form.Control
  as="select"
  value={selectedSkills[currentProfile - 1]?.equipment2 || ''}
  onChange={(e) => {
    const selectedPrimaryEquipment = selectedSkills[currentProfile - 1]?.equipment1 || '';
    const selectedSecondaryEquipment = e.target.value;
    handleSelectEquipment(currentProfile - 1, {
      primary: selectedPrimaryEquipment,
      secondary: selectedSecondaryEquipment,
    });
  }}
  className="tree"
>
  <option value="">Select Secondary Equipment</option>
  {equipments.map((equipment) => (
    <option key={equipment} value={equipment}>
      {equipment}
    </option>
  ))}
</Form.Control>
  )}
</Form> */}
 <Form className="grid-form-builder">
  <Form.Label onClick={() => toggleCategoryVisibility('equipment')} className="categoryName">EQUIPMENT</Form.Label>

  {/* Primary Equipment */}
  {categoryVisibility['equipment'] && (
    <Form.Control
      as="select"
      value={selectedSkills[currentProfile - 1]?.equipment1 || ''}
      onChange={(e) => {
        const selectedPrimaryEquipment = e.target.value;
        handleSelectEquipment(currentProfile - 1, { primary: selectedPrimaryEquipment });
      }}
      className="tree"
    >
      <option value="">Select Equipment</option>
      {equipments.map((equipment) => {
        const normalized = equipment.replace(/\s?\([^)]+\)/, '').trim();
        return (
          <option key={normalized} value={normalized}>
            {normalized}
          </option>
        );
      })}
    </Form.Control>
  )}
<div className="grid-container builder">
  {/* Rendering Primary Equipment Image */}
  {selectedSkills[currentProfile - 1]?.equipment1 && categoryVisibility['equipment'] && (
    (() => {
      const selectedPrimary = selectedSkills[currentProfile - 1]?.equipment1;
      const matchedPrimary = equipments.find((equipment) => {
        const trimmedPrimary = equipment.replace(/\s?\([^)]+\)/, '').trim();
        return trimmedPrimary === selectedPrimary;
      });
      return matchedPrimary ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matchedPrimary]}
          alt={matchedPrimary}
          className="grid-image builder"
        />
        </div>
      ) : null;
    })()
  )}
</div>

  {/* Secondary Equipment (Only if "Jack of All Trades" is aced) */}
  {selectedSkills[currentProfile - 1]?.["Jack of All Trades"] === "ace" && categoryVisibility['equipment'] && (
    <Form.Control
      as="select"
      value={selectedSkills[currentProfile - 1]?.equipment2 || ''}
      onChange={(e) => {
        const selectedPrimaryEquipment = selectedSkills[currentProfile - 1]?.equipment1 || '';
        const selectedSecondaryEquipment = e.target.value;
        handleSelectEquipment(currentProfile - 1, {
          primary: selectedPrimaryEquipment,
          secondary: selectedSecondaryEquipment,
        });
      }}
      className="tree"
    >
      <option value="">Select Secondary Equipment</option>
      {equipments.map((equipment) => {
        const normalized = equipment.replace(/\s?\([^)]+\)/, '').trim();
        return (
          <option key={normalized} value={normalized}>
            {normalized}
          </option>
        );
      })}
    </Form.Control>
  )}

<div className="grid-container builder">
  {/* Rendering Secondary Equipment Image */}
  {selectedSkills[currentProfile - 1]?.equipment2 && categoryVisibility['equipment'] && (
    (() => {
      const selectedSecondary = selectedSkills[currentProfile - 1]?.equipment2;
      const matchedSecondary = equipments.find((equipment) => {
        const trimmedSecondary = equipment.replace(/\s?\([^)]+\)/, '').trim();
        return trimmedSecondary === selectedSecondary;
      });
      return matchedSecondary ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matchedSecondary]}
          alt={matchedSecondary}
          className="grid-image builder"
        />
        </div>
      ) : null;
    })()
  )}
</div>
</Form>
{/* EQUIPMENTS END */}

{/* {categoryVisibility['equipment'] &&
<div className="separatorBuilder"></div>
} */}

{/* MELEES START */}
{/* <Form>
<Form.Label onClick={() => toggleCategoryVisibility('melee')} className="categoryName">MELEE</Form.Label>
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
      </Form> */}
 <Form className="grid-form-builder">
  <Form.Label onClick={() => toggleCategoryVisibility('melee')} className="categoryName">MELEE</Form.Label>
  {categoryVisibility['melee'] && (
    <Form.Control as="select"
      value={selectedSkills[currentProfile - 1]?.melee || ''}
      onChange={(e) => {
        const selected = e.target.value;
        handleSelectMelee(currentProfile - 1, selected);
      }}
      className="tree"
    >
      <option value="">Select Melee</option>
      {/* {melees.map((melee) => {
        const normalized = melee.replace(/\s?\([^)]+\)/, '').trim();
        return (
          <option key={normalized} value={normalized}>
            {normalized}
          </option>
        );
      })} */}
       {melees
      .map((melee) => {
        const normalized = melee.replace(/\s?\([^)]+\)/, '').trim(); // Normalize the melee name
        return normalized; // Return the normalized name
      })
      .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
      .map((normalized) => ( // Render the options using the normalized names
        <option key={normalized} value={normalized}>
          {normalized}
        </option>
      ))}
    </Form.Control>
  )}

  {/* Rendering the image */}
  <div className="grid-container builder">
  {selectedSkills[currentProfile - 1]?.melee && categoryVisibility['melee'] && (
    (() => {
      const selected = selectedSkills[currentProfile - 1]?.melee;

      const matched = melees.find((melee) => {
        const trimmed = melee.replace(/\s?\([^)]+\)/, '').trim();
        return trimmed === selected;
      });

      return matched ? (
        <div className="grid-item builder">
        <img
          src={itemsToImage[matched]}
          alt={matched}
          className="grid-image builder"
        />
        </div>
      ) : null;
    })()
  )}
  </div>
</Form>
{/* MELEES END */}

{/* {categoryVisibility['melee'] &&
<div className="separatorBuilder"></div>
} */}

</div>
{/* SKILLS START */}
<Form className="grid-form-builder">
  <Form.Label onClick={() => toggleCategoryVisibility('skill')} className="categoryName">SKILLS</Form.Label>
  {categoryVisibility['skill'] && (
    <>
      {Object.entries(sortedOrganizedSkills).map(([treeName, subtrees]) => (
        <div key={treeName} className="tree">
          <Form.Label onClick={() => toggleCategoryVisibility(treeName)} className="skillTreeName">
            <div>{treeName.toUpperCase()} ({treeSubtotals[treeName]})</div>
            {categoryVisibility[treeName] && (<div className="slideCounter">{currentSlide}/{totalSlides}</div>)}
          </Form.Label>
          
          {categoryVisibility[treeName] && (
            <>
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation={false}
              // loop={true}
              grabCursor={true}
              onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex + 1)} // Update current slide
            >
              {Object.entries(subtrees).map(([subtreeName, skills]) => {
                const tiers = [1, 2, 3, 4].reverse(); // Inverted tiers
                return (
                  <SwiperSlide key={subtreeName}>
                    <div className="subtree">
                      {tiers.map((tier) => {
                        const tierSkills = skills.filter((skill) => skill.tier === tier);
                        const pointsSpentInSubtree = calculateSubtreePoints(skills);
                        const isTierUnlocked = // Logic to check if the tier is unlocked
                          tier === 1 || 
                          (tier === 2 && pointsSpentInSubtree >= 1) || 
                          (tier === 3 && pointsSpentInSubtree >= 3) || 
                          (tier === 4 && pointsSpentInSubtree >= 16);

                        return (
                          <div key={tier} className={`tierContainer ${isTierUnlocked ? 'unlockedTier' : ''}`}>
                            <Row>
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
                                      backgroundImage:
                                        selectedSkills[currentProfile - 1][skill.name] === 'basic'
                                          ? 'none'
                                          : selectedSkills[currentProfile - 1][skill.name] === 'ace'
                                            ? aceImage
                                            : 'none',
                                      backgroundPosition: 'center',
                                      backgroundSize: '80px',
                                      backgroundRepeat: 'no-repeat',
                                      overflow: 'visible',
                                    }}
                                    disabled={!isTierUnlocked}
                                  >
                                    {(selectedSkills[currentProfile - 1][skill.name] === 'basic' ||
                                      selectedSkills[currentProfile - 1][skill.name] === 'ace') ? (
                                        <img
                                          src={iconSkills}
                                          alt={skill.name}
                                          style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'none',
                                            objectPosition: `-${skill.idWidth}px -${skill.idHeight}px`,
                                            display: 'block',
                                          }}
                                        />
                                      ) : (
                                        <img
                                          src={iconSkills}
                                          alt={skill.name}
                                          style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'none',
                                            objectPosition: `-${skill.idWidth}px -${skill.idHeight}px`,
                                            opacity: '40%',
                                          }}
                                        />
                                      )}
                                    {!isTierUnlocked && (
                                      <img
                                        src={lockSkill}
                                        alt={skill.name}
                                        style={{
                                          position: 'absolute',
                                          width: '45px',
                                          height: '45px',
                                          marginTop: '15px',
                                          marginLeft: '-60px',
                                        }}
                                      />
                                    )}
                                  </Button>
                                  <div>
                                    <span
                                      style={{
                                        fontWeight:
                                          selectedSkills[currentProfile - 1][skill.name] === 'basic' ||
                                          selectedSkills[currentProfile - 1][skill.name] === 'ace'
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
                          </div>
                        );
                      })}
                      <h3 className="subtreeName">{subtreeNames[subtreeName] || subtreeName}</h3>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            </>)}
        </div>
      ))}
    </>
  )}
</Form>
{/* SKILLS END */}

{/* TAGS START */}
{/* <Form className="grid-form-builder">
  <Form.Label onClick={() => toggleCategoryVisibility('tags')} className="categoryName">TAGS</Form.Label>
  {categoryVisibility['tags'] && (
    <div className="tree">
      <Row>
      {tags.map((tag) => (
        <Col xs={6} md={4} lg={3} key={tag} className="mb-2">
          <Form.Check
            type="checkbox"
            id={`tag-${tag}`}
            value={tag}
            checked={selectedSkills[currentProfile - 1]?.tags?.includes(tag) || false}
            onChange={(e) => handleSelectTags(currentProfile - 1, tag, e.target.checked)}
            label={tag}
          />
        </Col>
      ))}
      </Row>
    </div>
  )}
</Form> */}
{/* TAGS END */}

</Container>
{/* TAGS START */}
   {/* Floating Tags Container */}
   <Container className={`floating-tags-container ${isTagsActive ? "active" : ""}`}>
          <div className="floating-tags-title">TAGS</div>
            <Row>
              {tags.map((tag) => (
                <Col xs={6} key={tag} className="mb-1 mt-1">
                  <Form.Check
                    type="checkbox"
                    id={`tag-${tag}`}
                    value={tag}
                    checked={selectedSkills[currentProfile - 1]?.tags?.includes(tag) || false}
                    onChange={(e) =>
                      handleSelectTags(currentProfile - 1, tag, e.target.checked)
                    }
                    label={tag}
                  />
                </Col>
              ))}
            </Row>
      </Container>

      {/* Toggle Button */}
      <div
        className={`toggle-button-tags ${isTagsActive ? "active" : ""}`}
        onClick={toggleTagsVisibility}
      >
        {isTagsActive ? <IoPricetagsOutline/> : <IoPricetags/>}
      </div>
{/* TAGS END */}

  {/* <Container className="buttonGoToTop-container">
    <Button className="buttonGoToTop" onClick={() => goToTop()}>Go to top</Button>
  </Container> */}
  
        </div>
      );
  };
  
  export default Builder;
  