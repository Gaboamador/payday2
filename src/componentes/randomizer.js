import React, { useEffect, useState, useRef, useContext } from "react";
import {Button, Row, Col, Container, ListGroup, Table, Form, Accordion, Card, useAccordionButton} from 'react-bootstrap';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { CiGrid41, CiBoxList } from "react-icons/ci";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { BiReset } from "react-icons/bi";
import { FaLock, FaLockOpen } from 'react-icons/fa';
import '../App.css';
import { itemsToImage } from "../database/itemsToImage";
import Skull from "../imagenes/skull.svg"
import Skull2 from "../imagenes/skull2.svg"
import SelectCategories from "./SelectCategories";
import {options} from "../database/items";
import {heists} from "../database/items";
import {Clock} from "./clock"
import { modCategoryNames } from "../database/modCategoryNames";
import { PiGhost, PiGhostFill } from "react-icons/pi";
import Context from '../context'

const Payday2Randomizer = () => {

  const context= useContext(Context)
  
    // Helper function to get tags
  const getTags = (tags) => {
    if (!tags || tags.length === 0) return ['No tags available']; // Return as an array for consistency
    return tags.sort(); // Sort tags for display
  };

  // Helper function to render tags in a grid layout
  const renderTagsGrid = (tags) => {
    if (!tags || tags.length === 0 || tags.includes('No tags available')) {
      return <div>No tags available</div>;
    }

    return (
      <div className="tags-grid">
        {tags.map((tag, index) => (
          <div key={index} className="tag-item">{tag}</div>
        ))}
      </div>
    );
  };
  
  useEffect(() => {
    // const selectedSkills = JSON.parse(localStorage.getItem('selectedSkills')) || [];
    const selectedSkills = context.selectedSkills
    if (selectedSkills.length > 0) {
      const newProfiles = selectedSkills.map((profile, index) => {
        // Check each property for data
        const perkDeck = profile.perkDeck || 'No data available';
        const primaryWeapon = profile.primaryWeapon?.weapon || 'No data available';
        const primaryWeaponMods = profile.primaryWeapon?.mods ? Object.entries(profile.primaryWeapon.mods) : [];
        const secondaryWeapon = profile.secondaryWeapon?.weapon || 'No data available';
        const secondaryWeaponMods = profile.secondaryWeapon?.mods ? Object.entries(profile.secondaryWeapon.mods) : [];
        const melee = profile.melee || 'No data available';
        const throwable = profile.throwable || 'No data available';
        const armor = profile.armor || 'No data available';
        const equipment = profile.equipment || 'No data available';
        // const tags = profile.tags?.length > 0 ? profile.tags.sort() : ['No data available'];
        const tags = getTags(profile.tags);
  
        const allPropertiesEmpty = [
          perkDeck,
          primaryWeapon,
          secondaryWeapon,
          melee,
          throwable,
          armor,
          equipment,
          tags.join(', ')
        ].every(value => value === 'No data available');
  
        // Set profileName based on data availability
        return {
          profileName: allPropertiesEmpty ? "No profiles loaded" : `Profile ${index + 1}`,
          perkDeck,
          primaryWeapon,
          primaryWeaponMods,
          secondaryWeapon,
          secondaryWeaponMods,
          melee,
          throwable,
          armor,
          equipment,
          tags,
        };
      });
  
      // options.profiles = newProfiles;
      options.profiles = Array.isArray(newProfiles) ? newProfiles : [];
  
      // Update selectedOptions.profiles based on new profiles
      setSelectedOptions(prev => ({
        ...prev,
        profiles: newProfiles
      }));
  
    } else {
      const defaultProfile = [{ profileName: "No profiles loaded" }];
      options.profiles = defaultProfile;
  
      setSelectedOptions(prev => ({
        ...prev,
        profiles: defaultProfile
      }));
    }
  }, []);
  
  const [showModsPrimary, setShowModsPrimary] = useState(true);
  const [showModsSecondary, setShowModsSecondary] = useState(true);
  
  const handleModsToggle = (slot) => {
    if (slot === "primary") {
      setShowModsPrimary((prevState) => !prevState);
  } else if (slot === "secondary") {
    setShowModsSecondary((prevState) => !prevState);
  }
  };

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 767);
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


//  // Initialize selectedOptions state with all items checked
//  const [selectedOptions, setSelectedOptions] = useState(
//   Object.keys(options).reduce((acc, category) => {
//     acc[category] = Object.values(options[category]).flat(); // All items checked
//     return acc;
//   }, {})
// );
const [selectedOptions, setSelectedOptions] = useState(() => {
  const initialOptions = Object.keys(options).reduce((acc, category) => {
    if (category === 'heists') {
      // For heists, initialize all items as checked
      const allHeists = Object.keys(heists);
      acc[category] = allHeists;
    } else {
      // For other categories, initialize all items as checked
      acc[category] = Object.values(options[category]).flat();
    }
    return acc;
  }, {});

  return initialOptions;
});

const areAllItemsCheckedInCategory = (category) => {
  const allItemsInCategory = Object.values(options[category]).flat();
  const currentlySelected = selectedOptions[category] || [];

  // Check if every item in the category is selected
  return allItemsInCategory.length > 0 && allItemsInCategory.every(item => currentlySelected.includes(item));
};


  const perkDeckToThrowable = {
    "Stoic (19)": "Stoic Hip Flask",
    "Kingpin (17)": "Injector",
    "Sicario (18)": "Smoke Bomb",
    "Hacker (20)": "Pocket ECM"
  };
  
  const [randomizedBuild, setRandomizedBuild] = useState({
    armor: localStorage.getItem("randomizedBuild_armor") || "",
    equipment: localStorage.getItem("randomizedBuild_equipment") || "",
    melee: localStorage.getItem("randomizedBuild_melee") || "",
    perkDeck: localStorage.getItem("randomizedBuild_perkDeck") || "",
    primaryGun: localStorage.getItem("randomizedBuild_primaryGun") || "",
    secondaryGun: localStorage.getItem("randomizedBuild_secondaryGun") || "",
    throwable: localStorage.getItem("randomizedBuild_throwable") || ""
  });

  useEffect(() => {
    localStorage.setItem("randomizedBuild_armor", randomizedBuild.armor);
    localStorage.setItem("randomizedBuild_equipment", randomizedBuild.equipment);
    localStorage.setItem("randomizedBuild_melee", randomizedBuild.melee);
    localStorage.setItem("randomizedBuild_perkDeck", randomizedBuild.perkDeck);
    localStorage.setItem("randomizedBuild_primaryGun", randomizedBuild.primaryGun);
    localStorage.setItem("randomizedBuild_secondaryGun", randomizedBuild.secondaryGun);
    localStorage.setItem("randomizedBuild_throwable", randomizedBuild.throwable);
  }, [randomizedBuild]);

  const [randomizedHeist, setRandomizedHeist] = useState({
    heist: localStorage.getItem("randomizedHeist_heist") || "",
  })
  useEffect(() => {
    localStorage.setItem("randomizedHeist_heist", randomizedHeist.heist);
  }, [randomizedHeist]);

  const [randomizedDifficulty, setRandomizedDifficulty] = useState({
    difficulty: localStorage.getItem("randomizedDifficulty_difficulty") || "",
  })
  const difficulty = randomizedDifficulty.difficulty;
  useEffect(() => {
    localStorage.setItem("randomizedDifficulty_difficulty", randomizedDifficulty.difficulty);
  }, [randomizedDifficulty]);


  const [randomizedProfile, setRandomizedProfile] = useState(() => {
    try {
      const storedProfile = localStorage.getItem("randomizedProfile_profile");
      return storedProfile ? JSON.parse(storedProfile) : {};
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      return {}; // Return an empty object in case of error
    }
  });
  
  
  useEffect(() => {
    if (randomizedProfile.profileName) {
      localStorage.setItem("randomizedProfile_profile", JSON.stringify(randomizedProfile));
    }
  }, [randomizedProfile]);
  

  const [showTable, setShowTable] = useState(false);

  const [showTableHeist, setShowTableHeist] = useState(false);

  const [showTableDifficulty, setShowTableDifficulty] = useState(false);

  const [showTableProfile, setShowTableProfile] = useState(false);

  const [displayType, setDisplayType] = useState(false);



  const handleResetBuild = () => {
    setRandomizedBuild({
      armor: "",
      equipment: "",
      melee: "",
      perkDeck: "",
      primaryGun: "",
      secondaryGun: "",
      throwable: ""
    });
    localStorage.removeItem("randomizedBuild_armor");
    localStorage.removeItem("randomizedBuild_equipment");
    localStorage.removeItem("randomizedBuild_melee");
    localStorage.removeItem("randomizedBuild_perkDeck");
    localStorage.removeItem("randomizedBuild_primaryGun");
    localStorage.removeItem("randomizedBuild_secondaryGun");
    localStorage.removeItem("randomizedBuild_throwable");
    setShowTable(false)
  };

  const handleResetHeist = () => {
    setRandomizedHeist({
      heist: ""
    });
    localStorage.removeItem("randomizedHeist_heist");
    setShowTableHeist(false)
  };
  const handleResetDifficulty = () => {
    setRandomizedDifficulty({
      difficulty: ""
    });
    localStorage.removeItem("randomizedDifficulty_difficulty");
    setShowTableDifficulty(false)
  };
  const handleResetProfile = () => {
    setRandomizedProfile({
      profile: ""
    });
    localStorage.removeItem("randomizedProfile_profile");
    setShowTableProfile(false)
  };


  const getRandomItemFromSubcategories = (categoryOptions) => {
    if (!categoryOptions) return "";
  
    // If categoryOptions is an object (with subcategories), flatten the options
    if (typeof categoryOptions === 'object' && !Array.isArray(categoryOptions)) {
      const allItems = Object.values(categoryOptions).flat();
      return getRandomItem(allItems);
    }
  
    // If it's already an array, return a random item from it
    if (Array.isArray(categoryOptions)) {
      return getRandomItem(categoryOptions);
    }
  
    return ""; // Fallback in case nothing matches
  };
  
  const [perkDeckWeights, setPerkDeckWeights] = useState({});
  const [armorWeights, setArmorWeights] = useState({});
  const [throwableWeights, setThrowableWeights] = useState({});
  const [equipmentWeights, setEquipmentWeights] = useState({});
  const [meleeWeights, setMeleeWeights] = useState({});
  const [primaryGunWeights, setPrimaryGunWeights] = useState({});
  const [secondaryGunWeights, setSecondaryGunWeights] = useState({});
  const [itemWeights, setItemWeights] = useState({
    primaryGuns: {},
    secondaryGuns: {},
  });

const updateWeights = (category, item) => {
  switch (category) {
    case 'perkDecks':
      setPerkDeckWeights(prev => ({ ...prev, [item]: (prev[item] || 1) * 0.5 }));
      break;
    case 'armors':
      setArmorWeights(prev => ({ ...prev, [item]: (prev[item] || 1) * 0.5 }));
      break;
    case 'throwables':
      setThrowableWeights(prev => ({ ...prev, [item]: (prev[item] || 1) * 0.5 }));
      break;
    case 'equipments':
      setEquipmentWeights(prev => ({ ...prev, [item]: (prev[item] || 1) * 0.5 }));
      break;
    case 'melees':
      setMeleeWeights(prev => ({ ...prev, [item]: (prev[item] || 1) * 0.5 }));
      break;
    case 'primaryGuns':
    case 'secondaryGuns':
      setItemWeights(prev => ({
        ...prev,
        [category]: { ...prev[category], [item]: (prev[category][item] || 1) * 0.5 }
      }));
      break;
    default:
      break;
  }
};

const getRandomWeightedItemFromSubcategories = (selectedItems, itemWeights) => {
  // Flatten the subcategories into a single array of items
  const allItems = Object.values(selectedItems).flat();

  // If no items are selected, return null
  if (allItems.length === 0) {
    return null;
  }

  // Calculate the total weight for the remaining items
  const totalWeight = allItems.reduce((sum, item) => sum + (itemWeights[item] || 1), 0);

  // Generate a random number between 0 and the total weight
  const randomNumber = Math.random() * totalWeight;

  // Iterate through the items and pick the one based on the weights
  let accumulatedWeight = 0;
  for (const item of allItems) {
    accumulatedWeight += itemWeights[item] || 1;
    if (randomNumber <= accumulatedWeight) {
      return item;
    }
  }

  // Fallback in case something went wrong (shouldn't happen)
  return allItems[allItems.length - 1];
};


  const handleRandomizeOld = () => {

    const randomizedPerkDeck = selectedCategories.includes('perkDecks') ? getRandomWeightedItem(selectedOptions.perkDecks, perkDeckWeights) : localStorage.getItem("randomizedBuild_perkDeck") || "";

    const randomizedBuild = {
      primaryGun: selectedCategories.includes('primaryGuns') 
        // ? getRandomItemFromSubcategories(selectedOptions.primaryGuns) 
        ? getRandomWeightedItemFromSubcategories('primaryGuns') 
        : localStorage.getItem("randomizedBuild_primaryGun") || "",
    
      secondaryGun: selectedCategories.includes('secondaryGuns') 
        // ? getRandomItemFromSubcategories(selectedOptions.secondaryGuns) 
        ? getRandomWeightedItemFromSubcategories('secondaryGuns') 
        : localStorage.getItem("randomizedBuild_secondaryGun") || "",
    
      perkDeck: randomizedPerkDeck,
    
      armor: selectedCategories.includes('armors') 
        // ? getRandomItem(selectedOptions.armors) 
        ? getRandomWeightedItem(selectedOptions.armors, armorWeights) 
        : localStorage.getItem("randomizedBuild_armor") || "",
    
      throwable: selectedCategories.includes('throwables') 
        // ? (perkDeckToThrowable[randomizedPerkDeck] || getRandomItem(selectedOptions.throwables)) 
        ? (perkDeckToThrowable[randomizedPerkDeck] || "") || getRandomWeightedItem(selectedOptions.throwables, throwableWeights)
        : localStorage.getItem("randomizedBuild_throwable") || "",
    
      equipment: selectedCategories.includes('equipments') 
        // ? getRandomItem(selectedOptions.equipments) 
        ? getRandomWeightedItem(selectedOptions.equipments, equipmentWeights) 
        : localStorage.getItem("randomizedBuild_equipment") || "",
    
      melee: selectedCategories.includes('melees') 
        // ? getRandomItem(selectedOptions.melees) 
        ? getRandomWeightedItem(selectedOptions.melees, meleeWeights) 
        : localStorage.getItem("randomizedBuild_melee") || "",
    };
    

    setRandomizedBuild(randomizedBuild);
    setShowTable(true);
  };

  const handleRandomize = () => {
    const randomizedPrimaryGun = selectedCategories.includes('primaryGuns') 
      ? getRandomWeightedItemFromSubcategories(selectedOptions.primaryGuns, primaryGunWeights)
      : localStorage.getItem("randomizedBuild_primaryGun") || "";
  
    const randomizedSecondaryGun = selectedCategories.includes('secondaryGuns') 
      ? getRandomWeightedItemFromSubcategories(selectedOptions.secondaryGuns, secondaryGunWeights)
      : localStorage.getItem("randomizedBuild_secondaryGun") || "";
  
    const randomizedPerkDeck = selectedCategories.includes('perkDecks') 
      ? getRandomWeightedItem(selectedOptions.perkDecks, perkDeckWeights) 
      : localStorage.getItem("randomizedBuild_perkDeck") || "";
  
    const randomizedArmor = selectedCategories.includes('armors') 
      ? getRandomWeightedItem(selectedOptions.armors, armorWeights) 
      : localStorage.getItem("randomizedBuild_armor") || "";
  
    const randomizedThrowable = selectedCategories.includes('throwables') 
      ? (perkDeckToThrowable[randomizedPerkDeck] || getRandomWeightedItem(selectedOptions.throwables, throwableWeights) || "") 
      : localStorage.getItem("randomizedBuild_throwable") || "";
  
    const randomizedEquipment = selectedCategories.includes('equipments') 
      ? getRandomWeightedItem(selectedOptions.equipments, equipmentWeights) 
      : localStorage.getItem("randomizedBuild_equipment") || "";
  
    const randomizedMelee = selectedCategories.includes('melees') 
      ? getRandomWeightedItem(selectedOptions.melees, meleeWeights) 
      : localStorage.getItem("randomizedBuild_melee") || "";
  
    // Update weights after randomizing
    updateWeights('primaryGuns', randomizedPrimaryGun);
    updateWeights('secondaryGuns', randomizedSecondaryGun);
    updateWeights('perkDecks', randomizedPerkDeck);
    updateWeights('armors', randomizedArmor);
    updateWeights('throwables', randomizedThrowable);
    updateWeights('equipments', randomizedEquipment);
    updateWeights('melees', randomizedMelee);
  
    const randomizedBuild = {
      primaryGun: randomizedPrimaryGun,
      secondaryGun: randomizedSecondaryGun,
      perkDeck: randomizedPerkDeck,
      armor: randomizedArmor,
      throwable: randomizedThrowable,
      equipment: randomizedEquipment,
      melee: randomizedMelee,
    };
  
    setRandomizedBuild(randomizedBuild);
    setShowTable(true);
  };
  

    const [heistWeights, setHeistWeights] = useState({});

    const handleRandomizeHeist = () => {
      if (!selectedOptions.heists || selectedOptions.heists.length === 0) {
        return; // If no heist is selected, exit the function
      }
    
      const remainingHeists = selectedOptions.heists.filter(heistKey => !heistWeights[heistKey]);
      setShowTableHeist(true);
      if (remainingHeists.length === 0) {
        // All heists have been picked, reset the weights
        setHeistWeights({});
      } else {
        const randomHeistKey = getRandomWeightedItem(remainingHeists, heistWeights);
        const updatedWeights = {
          ...heistWeights,
          [randomHeistKey]: (heistWeights[randomHeistKey] || 1) * 0.5, // Decrease the weight by half
        };
        setHeistWeights(updatedWeights);
        setRandomizedHeist({ heist: randomHeistKey });
        setShowTableHeist(true);
      }
    };
    
    
  
  const getRandomWeightedItem = (items, weights) => {
    // Calculate the total weight
    const totalWeight = items.reduce((sum, item) => sum + (weights[item] || 1), 0);
  
    // Generate a random number between 0 and the total weight
    const randomNumber = Math.random() * totalWeight;
  
    // Iterate through the items and pick the one based on the weights
    let accumulatedWeight = 0;
    for (const item of items) {
      accumulatedWeight += weights[item] || 1;
      if (randomNumber <= accumulatedWeight) {
        return item;
      }
    }
  
    // Fallback in case something went wrong
    return items[items.length - 1];
  };  

  // FIN NUEVA FUNCIÓN RANDOMIZER CON WEIGHT

  const handleRandomizeDifficulty = () => {
    const randomDifficulty = getRandomItem(options.difficulty.difficulty);
    setRandomizedDifficulty({ difficulty: randomDifficulty });
    setShowTableDifficulty(true);
    return randomDifficulty;
  };


const [profilesWeights, setProfilesWeights] = useState({});

// const handleRandomizeProfile = () => {
//   const remainingProfiles = options.profiles.filter(profile => !profilesWeights[profile.profileName]);
  
//   if (remainingProfiles.length === 0) {
//     // All profiles have been picked, reset the weights
//     setProfilesWeights({});
//   } else {
//     const randomProfile = getRandomWeightedItem(remainingProfiles, profilesWeights);
    
//     const updatedWeights = {
//       ...profilesWeights,
//       [randomProfile.profileName]: (profilesWeights[randomProfile.profileName] || 1) * 0.5, // Decrease the weight by half
//     };
    
//     setProfilesWeights(updatedWeights);
    
//     // Update with the selected profile object instead of just a name
//     setRandomizedProfile(randomProfile);
//     setShowTableProfile(true);
//   }
// };
const handleRandomizeProfile = () => {
  // console.log('Selected profiles:', selectedOptions.profiles); // Debugging

  if (!selectedOptions.profiles || selectedOptions.profiles.length === 0) {
    return; // Exit if no profiles are selected
  }

  const remainingProfiles = selectedOptions.profiles.filter(
    profile => !profilesWeights[profile.profileName]
  );

  if (remainingProfiles.length === 0) {
    setProfilesWeights({});
  } else {
    const randomProfile = getRandomWeightedItem(remainingProfiles, profilesWeights);
    
    const updatedWeights = {
      ...profilesWeights,
      [randomProfile.profileName]: (profilesWeights[randomProfile.profileName] || 1) * 0.5,
    };

    setProfilesWeights(updatedWeights);
    setRandomizedProfile(randomProfile);
    setShowTableProfile(true);
  }
};





  const getRandomItem = (items) => {
    if (items.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };



// Initialize collapsed state for categories and subcategories
const [collapsed, setCollapsed] = useState(
  Object.keys(options).reduce((acc, key) => {
    acc[key] = true; // Start all categories collapsed
    return acc;
  }, {})
);

const [collapsedSubcategories, setCollapsedSubcategories] = useState(
  Object.keys(options).reduce((acc, key) => {
    acc[key] = Object.keys(options[key]).reduce((subAcc, subKey) => {
      subAcc[subKey] = true; // Start all subcategories collapsed
      return subAcc;
    }, {});
    return acc;
  }, {})
);

const toggleCollapse = (category) => {
  setCollapsed((prev) => ({
    ...prev,
    [category]: !prev[category],
  }));
};

const toggleSubcategory = (category, subcategory) => {
  setCollapsedSubcategories((prev) => ({
    ...prev,
    [category]: {
      ...prev[category],
      [subcategory]: !prev[category][subcategory],
    },
  }));
};

  const [activeKey, setActiveKey] = useState(null); // For controlled Accordion

    // Handle Accordion change event
  const handleAccordionSelect = (key) => {
    setActiveKey(key);

    if (key === null) {
      // If Accordion is fully collapsed
      setCollapsed((prev) => 
        Object.keys(prev).reduce((acc, category) => {
          acc[category] = true; // Set all categories to collapsed
          return acc;
        }, {})
      );
    } else {
      // Extract category from key and update custom state
      const [category] = key.split('-');
      if (category) {
        setCollapsed((prev) => ({
          ...prev,
          [category]: false, // Update to reflect Accordion expansion
        }));
      }
    }
  };

// const handleToggleCheckAll = (category, subcategory) => {
//   const subcategoryItems = options[category][subcategory];
//   const currentlySelected = selectedOptions[category];

//   // Check if all items in the subcategory are currently selected
//   const allChecked = subcategoryItems.every(item => currentlySelected.includes(item));

//   setSelectedOptions((prev) => {
//     if (allChecked) {
//       // If all items are checked, uncheck them
//       return {
//         ...prev,
//         [category]: prev[category].filter(item => !subcategoryItems.includes(item)),
//       };
//     } else {
//       // If not all items are checked, check them
//       return {
//         ...prev,
//         [category]: [...new Set([...prev[category], ...subcategoryItems])],
//       };
//     }
//   });
// };
// const handleToggleCheckAll = (category, subcategory) => {
//   if (category === 'heists') {
//     // Special handling for heists
//     const subcategoryItems = sortedHeists.filter(heist => heists[heist][sortCriteria] === subcategory);
//     const currentlySelected = selectedOptions.heists;

//     // Check if all items in the subcategory are currently selected
//     const allChecked = subcategoryItems.every(item => currentlySelected.includes(item));

//     setSelectedOptions((prev) => {
//       if (allChecked) {
//         // If all items are checked, uncheck them
//         return {
//           ...prev,
//           heists: prev.heists.filter(item => !subcategoryItems.includes(item)),
//         };
//       } else {
//         // If not all items are checked, check them
//         return {
//           ...prev,
//           heists: [...new Set([...prev.heists, ...subcategoryItems])],
//         };
//       }
//     });
//   } else {
//     // Existing handling for other categories
//     const subcategoryItems = options[category][subcategory];
//     const currentlySelected = selectedOptions[category];

//     // Check if all items in the subcategory are currently selected
//     const allChecked = subcategoryItems.every(item => currentlySelected.includes(item));

//     setSelectedOptions((prev) => {
//       if (allChecked) {
//         // If all items are checked, uncheck them
//         return {
//           ...prev,
//           [category]: prev[category].filter(item => !subcategoryItems.includes(item)),
//         };
//       } else {
//         // If not all items are checked, check them
//         return {
//           ...prev,
//           [category]: [...new Set([...prev[category], ...subcategoryItems])],
//         };
//       }
//     });
//   }
// };
const handleToggleCheckAll = (category, subcategory) => {
  if (category === 'heists') {
    // Special handling for heists
    const subcategoryItems = sortedHeists.filter(heist => heists[heist][sortCriteria] === subcategory);
    const currentlySelected = selectedOptions.heists;

    const allChecked = subcategoryItems.every(item => currentlySelected.includes(item));

    setSelectedOptions((prev) => {
      if (allChecked) {
        // Uncheck all items in subcategory
        return {
          ...prev,
          heists: prev.heists.filter(item => !subcategoryItems.includes(item)),
        };
      } else {
        // Check all items in subcategory
        return {
          ...prev,
          heists: [...new Set([...prev.heists, ...subcategoryItems])],
        };
      }
    });
  } else if (category === 'profiles') {
    // Handle profiles based on tag subcategory
    if (sortProfileCriteria === 'tags') {
      const subcategoryItems = options.profiles.filter(profile => profile.tags.includes(subcategory));
      const currentlySelected = selectedOptions.profiles;

      const allChecked = subcategoryItems.every(profile => 
        currentlySelected.some(selectedProfile => selectedProfile.profileName === profile.profileName)
      );

      setSelectedOptions((prev) => {
        if (allChecked) {
          // Uncheck all profiles with the current tag
          return {
            ...prev,
            profiles: prev.profiles.filter(profile => 
              !subcategoryItems.some(subProfile => subProfile.profileName === profile.profileName)
            ),
          };
        } else {
          // Check all profiles with the current tag
          return {
            ...prev,
            profiles: [...new Set([...prev.profiles, ...subcategoryItems])],
          };
        }
      });
    } else {
      // Handle sorting by other criteria (e.g., perkDeck, primaryWeapon)
      const subcategoryItems = sortedProfiles.filter(profile => profile[sortProfileCriteria] === subcategory);
      const currentlySelected = selectedOptions.profiles;

      const allChecked = subcategoryItems.every(profile => 
        currentlySelected.some(selectedProfile => selectedProfile.profileName === profile.profileName)
      );

      setSelectedOptions((prev) => {
        if (allChecked) {
          // Uncheck all profiles in the subcategory
          return {
            ...prev,
            profiles: prev.profiles.filter(profile => 
              !subcategoryItems.some(subProfile => subProfile.profileName === profile.profileName)
            ),
          };
        } else {
          // Check all profiles in the subcategory
          return {
            ...prev,
            profiles: [...new Set([...prev.profiles, ...subcategoryItems])],
          };
        }
      });
    }
  } else {
    // Handle other categories
    const subcategoryItems = options[category][subcategory];
    const currentlySelected = selectedOptions[category];

    const allChecked = subcategoryItems.every(item => currentlySelected.includes(item));

    setSelectedOptions((prev) => {
      if (allChecked) {
        // Uncheck all items in the subcategory
        return {
          ...prev,
          [category]: prev[category].filter(item => !subcategoryItems.includes(item)),
        };
      } else {
        // Check all items in the subcategory
        return {
          ...prev,
          [category]: [...new Set([...prev[category], ...subcategoryItems])],
        };
      }
    });
  }
};




const handleOptionChange = (category, itemKey, isChecked) => {
  setSelectedOptions(prevOptions => {
    const updatedOptions = { ...prevOptions };
    if (isChecked) {
      updatedOptions[category] = [...(updatedOptions[category] || []), itemKey];
    } else {
      updatedOptions[category] = (updatedOptions[category] || []).filter(item => item !== itemKey);
    }
    return updatedOptions;
  });
};


  const toggleAllCollapse = () => {
    const newCollapseState = !collapsed.all; // Determine if collapsing or expanding
  
    // Update top-level category collapse state
    setCollapsed((prev) => {
      const updatedCategories = Object.keys(prev).reduce((acc, category) => {
        acc[category] = newCollapseState;
        return acc;
      }, {});
      
      return {
        ...prev,
        ...updatedCategories,
        all: newCollapseState
      };
    });
  
    // Update subcategory collapse state
    setCollapsedSubcategories((prev) => {
      const updatedSubcategories = Object.keys(prev).reduce((acc, category) => {
        acc[category] = Object.keys(prev[category] || {}).reduce((subAcc, subcategory) => {
          subAcc[subcategory] = newCollapseState;
          return subAcc;
        }, {});
        return acc;
      }, {});
      
      return updatedSubcategories;
    });
  };
  
  

  
  const handleToggleSelectedCategories = () => {
    setSelectedCategories((prevState) => {
      return prevState.length === Object.keys(selectedOptions).length ? [] : Object.keys(selectedOptions);
    });
  };
  
  const handleToggleCheckAllCategories = () => {
    setSelectedOptions((prevState) => {
      const allCategoriesChecked = Object.keys(prevState).every((category) => {
        // Flatten the subcategories for comparison
        const allItemsInCategory = Object.values(options[category]).flat();
        return prevState[category].length === allItemsInCategory.length;
      });
  
      const updatedSelection = allCategoriesChecked
        ? Object.keys(prevState).reduce((acc, category) => {
            acc[category] = [];
            return acc;
          }, {})
        : Object.keys(prevState).reduce((acc, category) => {
            // Flatten subcategories to select all items
            acc[category] = Object.values(options[category]).flat();
            return acc;
          }, {});
  
      return updatedSelection;
    });
  };

  const handleToggleCheckAllInCategory = (category) => {
    setSelectedOptions((prevState) => {
      const allItemsInCategory = Object.values(options[category]).flat();
      const currentlySelected = prevState[category];
  
      // Check if all items in the category are currently selected
      const allChecked = allItemsInCategory.every(item => currentlySelected.includes(item));
  
      return {
        ...prevState,
        [category]: allChecked
          ? [] // Uncheck all items if they are all currently checked
          : allItemsInCategory, // Check all items if they are not all currently checked
      };
    });
  };
  

const categories = [
  { key: "primaryGuns", label: "Primary Guns" },
  { key: "secondaryGuns", label: "Secondary Guns" },
  { key: "perkDecks", label: "Perk Decks" },
  { key: "armors", label: "Armors" },
  { key: "throwables", label: "Throwables" },
  { key: "equipments", label: "Equipments" },
  { key: "melees", label: "Melees" },
  { key: "heists", label: "Heists" },
];

const subcategories = [
  { key: 'AssaultRifles', label: 'Assault Rifles' },
  { key: 'Shotguns', label: 'Shotguns' },
  { key: 'AkimboPistols', label: 'Akimbo Pistols' },
  { key: 'AkimboShotguns', label: 'Akimbo Shotguns' },
  { key: 'AkimboSMGs', label: 'Akimbo SMGs' },
  { key: 'SniperRifles', label: 'Sniper Rifles' },
  { key: 'LightMachineGuns', label: 'Light Machine Guns' },
  { key: 'Specials', label: 'Specials' },
  { key: 'Pistols', label: 'Pistols' },
  { key: 'SubmachineGuns', label: 'Submachine Guns' },
]

  const initialSelectedCategories = [
    "primaryGuns",
    "secondaryGuns",
    "perkDecks",
    "armors",
    "throwables",
    "equipments",
    "melees"
  ];

  const [selectedCategories, setSelectedCategories] = useState(initialSelectedCategories);

  const [isCheckboxMode, setIsCheckboxMode] = useState(true);

  const toggleMode = () => {
    setIsCheckboxMode(!isCheckboxMode);
    if (isCheckboxMode) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(initialSelectedCategories);
    }
  }

  const handleToggleCategory = (category) => {
    if (isCheckboxMode) {
      setSelectedCategories((prevSelectedCategories) => {
        if (prevSelectedCategories.includes(category)) {
          return prevSelectedCategories.filter((c) => c !== category);
        } else {
          return [...prevSelectedCategories, category];
        }
      });
    } else {
      setSelectedCategories([category]);
    }
  };


  const generateDifficultyImages = (difficulty) => {
    let images = [];
    if (difficulty === "Very Hard") {
      images = [Skull, Skull];
    } else if (difficulty === "Overkill") {
      images = [Skull, Skull, Skull];
    } else if (difficulty === "Mayhem") {
      images = [Skull, Skull, Skull, Skull2];
    }
    return images;
  };
  const images = generateDifficultyImages(difficulty);

  const splitHeistString = (heistString, part) => {
    if (!heistString) {
      return null;
    }
    const [heist, details] = heistString.split(' (');
    return (
      <div>
        {part === "heist" && heist}
        {part === "details" && details.slice(0, -1)}
      </div>
    );
  };

  // const parseProfile = (profileString) => {
  //   if (!profileString) {
  //     return null;
  //   }  
  //   const lines = profileString.split('\n').filter(line => line.trim() !== '');
  //   if (lines.length < 13) {
  //     return null;
  //   }
  //   const profile = {
  //     profileName: lines[0].split(' (')[0],
  //     perkDeck: lines[0].split('(')[1].slice(0, -1),
  //     primaryWeapon: lines[2].slice(2),
  //     secondaryWeapon: lines[4].slice(2),
  //     melee: lines[6].slice(2),
  //     throwable: lines[8].slice(2),
  //     armor: lines[10].slice(2),
  //     equipment: lines[12].slice(2)
  //   };
  //   return profile;
  // };

  // const renderProfile = randomizedProfile.profile ? parseProfile(randomizedProfile.profile) : randomizedProfile.profile;

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem((prevSelectedItem) => (prevSelectedItem === item ? null : item));
  };

  const buildItems = [
    { key: 'primaryGun', title: 'PRIMARY' },
    { key: 'secondaryGun', title: 'SECONDARY' },
    { key: 'perkDeck', title: 'PERK DECK' },
    { key: 'armor', title: 'ARMOR' },
    { key: 'throwable', title: 'THROWABLE' },
    { key: 'equipment', title: 'EQUIPMENT' },
    { key: 'melee', title: 'MELEE' },
  ];

  const getCategoryKey = (key) => {
    return key.endsWith('s') ? key : `${key}s`;
  };

  /* STICKY BUILD RANDOMIZER */
  const [isSticky, setIsSticky] = useState(false);
  const stickyDivRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (stickyDivRef.current) {
        const rect = stickyDivRef.current.getBoundingClientRect();
        // Check if the top of the element is less than or equal to the header height
        setIsSticky(rect.top <= 45);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check immediately on mount

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  /**/

    /* STICKY CATEGORIES */
    // const [isStickyCategory, setIsStickyCategory] = useState(false);
    // const stickyCategoryDivRef = useRef(null);
    // useEffect(() => {
    //   const handleScroll = () => {
    //     if (stickyCategoryDivRef.current) {
    //       const rect = stickyCategoryDivRef.current.getBoundingClientRect();
    //       setIsStickyCategory(rect.top <= 45);
    //     }
    //   };
  
    //   window.addEventListener('scroll', handleScroll);
    //   handleScroll();
  
    //   return () => {
    //     window.removeEventListener('scroll', handleScroll);
    //   };
    // }, []);
    const [stickyStates, setStickyStates] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const updatedStickyStates = {};
      
      // Check sticky state for each category
      Object.keys(refs.current).forEach((category) => {
        const ref = refs.current[category];
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // Set sticky state based on whether the element has reached the top
          updatedStickyStates[category] = rect.top <= 45;
        }
      });

      setStickyStates(updatedStickyStates);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Run the handler once to set initial state
    handleScroll();

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    /**/

const excludedCategories = ["difficulty"]; // Categories you don't want to include in the form

function CustomToggle({ children, eventKey, category }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {
      // Update collapsed state: only expand the clicked category
      
      setCollapsed(prev => {
        const updatedCollapsed = Object.keys(prev).reduce((acc, cat) => {
          // acc[cat] = cat === category ? false : true;
          acc[cat] = cat === category ? !prev[cat] : true;
          return acc;
        }, {});
        return updatedCollapsed;
      });
    });

  return (
    <Button
      type="button"
      className={`custom-toggle ${!collapsed[category] ? "shrink-width" : "full-width"}`}
      onClick={decoratedOnClick}
    >
      {children} {!collapsed[category] ? <GoChevronUp /> : <GoChevronDown />}
    </Button>
  );
}


// function SubcategoryToggle({ children, eventKey, category, subcategory }) {
//   const decoratedOnClick = useAccordionButton(eventKey, () =>
//     toggleSubcategory(category, subcategory)
//   );

//   return (
//     <Button
//       type="button"
//       className="subcategory-header"
//       onClick={decoratedOnClick}
//     >
//       {children} {!collapsedSubcategories[category]?.[subcategory] ? <GoChevronUp /> : <GoChevronDown />}
//     </Button>
//   );
// }
function SubcategoryToggle({ children, eventKey, category, subcategory }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    toggleSubcategory(category, subcategory)
  );

  // Determine if the current subcategory is collapsed
  const isCollapsed = !collapsedSubcategories[category]?.[subcategory];

  // Apply different logic based on the category
  const isHeistCategory = category === 'heists';

  return (
    <Button
      type="button"
      className="subcategory-header"
      onClick={decoratedOnClick}
    >
      {children}
      {isHeistCategory ? (
        // For heists category, reverse the logic
        isCollapsed ? <GoChevronDown /> : <GoChevronUp />
      ) : (
        // For other categories, use normal logic
        isCollapsed ? <GoChevronUp /> : <GoChevronDown />
      )}
    </Button>
  );
}

function ProfilesToggle ({ children, eventKey, category, subcategory }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    toggleSubcategory(category, subcategory)
  );

  // Determine if the current subcategory is collapsed
  const isCollapsed = !collapsedSubcategories[category]?.[subcategory];

  // Apply different logic based on the category
  const isProfileCategory = category === 'profiles';

  return (
    <Button
      type="button"
      className="subcategory-header"
      onClick={decoratedOnClick}
    >
      {children}
      {isProfileCategory ? (
        // For profiles category, use normal logic
        !isCollapsed ? <GoChevronUp /> : <GoChevronDown />
      ) : (
        // For other categories, use normal logic
        !isCollapsed ? <GoChevronDown /> : <GoChevronUp />
      )}
    </Button>
  );
};




const [sortCriteria, setSortCriteria] = useState('name'); // Default sorting by name
  const [isSortedAsc, setIsSortedAsc] = useState(true); // Default sorting order (ascending)

  // Sort heists based on the selected criteria
  const sortedHeists = [...options.heists.heists].sort((a, b) => {
    const aValue = heists[a][sortCriteria];
    const bValue = heists[b][sortCriteria];

    if (aValue < bValue) return isSortedAsc ? -1 : 1;
    if (aValue > bValue) return isSortedAsc ? 1 : -1;
    return 0;
  });

  // Get unique values for subcategories based on the sorting criteria
  const getSubcategories = () => {
    const values = new Set(sortedHeists.map((heist) => heists[heist][sortCriteria]));
    return Array.from(values).sort();
  };

  const subcategoriesHeist = getSubcategories();

  const handleSortChange = (criteria) => {
    if (sortCriteria === criteria) {
      setIsSortedAsc(!isSortedAsc);
    } else {
      setSortCriteria(criteria);
      setIsSortedAsc(true); // Default to ascending when changing criteria
    }
  };

  const removePrefix = (text) => {
    return text.replace(/^\d+\. /, ''); // Remove prefix like "1. ", "2. ", etc.
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = useAccordionButton(0, () => {
    setIsOpen(prevState => !prevState); // Toggle the state
  });
  

  // State for sorting profiles
const [sortProfileCriteria, setSortProfileCriteria] = useState(''); // Default to no sorting
const [sortedProfiles, setSortedProfiles] = useState(options.profiles); // Start with all profiles
const [sortedProfilesByProperty, setSortedProfilesByProperty] = useState([]);
const handleProfileSortChange = (criteria) => {
  setSortProfileCriteria(criteria);

  // Filter out "No data available" entries from the sorted profiles
  const filteredProfiles = options.profiles.filter(profile => profile[criteria] !== 'No data available');
  
  // Extract unique values for the selected criteria
  const sortedByProperty = [...new Set(filteredProfiles.map((profile) => profile[criteria]))];
  
  // Remove any empty or invalid entries
  const validSortedByProperty = sortedByProperty.filter(value => value && value !== 'No data available');

  // Update the state with valid sorted profiles
  setSortedProfilesByProperty(validSortedByProperty);

  // Sort profiles based on the selected criteria
  const sorted = filteredProfiles.sort((a, b) => {
    if (a[criteria] < b[criteria]) return -1;
    if (a[criteria] > b[criteria]) return 1;
    return 0;
  });

  setSortedProfiles(sorted);
};


// const handleToggleLock = (key) => {
//   setSelectedCategories(prevSelectedCategories =>
//     prevSelectedCategories.includes(key)
//       ? prevSelectedCategories.filter(category => category !== key) // Remove if already selected
//       : [...prevSelectedCategories, key] // Add if not selected
//   );
// };
const handleToggleLock = (key) => {
  const pluralKey = key + 's'; // Convert to plural (e.g., "primaryGuns")

  setSelectedCategories((prevSelectedCategories) => {

    if (prevSelectedCategories.includes(pluralKey)) {
      // Item is currently locked, remove it from selectedCategories
      const updatedCategories = prevSelectedCategories.filter(category => category !== pluralKey);
      return updatedCategories;
    } else {
      // Item is currently unlocked, add it to selectedCategories
      const updatedCategories = [...prevSelectedCategories, pluralKey];
      return updatedCategories;
    }
  });
};








return (
<div className="backgroundColor">

<div className="component-title">RANDOMIZER</div>

<div className="randomBuildContainer backgroundImage difficulty"  style={{marginTop: 0}}>
{!isWideScreen && <div className="randomBuildContainer-title">DIFFICULTY</div>}
<div className="buttons">
          <Button className={`${isWideScreen ? 'randomizeButton' : 'eyeSlashButton'}`} onClick={handleRandomizeDifficulty}>
          {isWideScreen ? 'RANDOMIZE DIFFICULTY' : <GiPerspectiveDiceSixFacesRandom/>}
            </Button>
          <Button className="eyeSlashButton reset" onClick={() => handleResetDifficulty()}>
          {isWideScreen ? 'RESET DIFFICULTY' : <BiReset />}
            </Button>
          <Button className="eyeSlashButton" onClick={() => setShowTableDifficulty((prevState) => !prevState)}>{showTableDifficulty ? <FiEyeOff/> : <FiEye/>}</Button>
          </div>

    {showTableDifficulty &&  randomizedDifficulty.difficulty && (
    <>
    <div className="difficulty-title">
    {randomizedDifficulty.difficulty}
    </div>
    <div className="difficulty-images">
    {images.map((Image, index) => (
      <img key={index} src={Image} alt="difficulty icon" className="difficulty-image"/>
    ))}
  </div>
  </>
    )}
  </div>
  
  {/* <div className={`randomBuildContainer backgroundImage ${showTable && Object.values(randomizedBuild).some(value => value !== "") ? 'inventory' : ''}`}> */}
  <div className={`randomBuildContainer backgroundImage ${showTable && Object.values(randomizedBuild).some(value => value != null && value !== "") ? 'inventory' : ''}`}>

  
{/* <div className="stickyDiv"> */}
<div ref={stickyDivRef} className={`stickyDiv ${isSticky ? 'sticky' : ''}`}>
  {!isWideScreen && <div className="randomBuildContainer-title">BUILD</div>}
        <div className="buttons">
          <Button className={`${isWideScreen ? 'randomizeButton threeRows' : 'eyeSlashButton'}`} onClick={handleRandomize}>
            {isWideScreen ? 'RANDOMIZE BUILD' : <GiPerspectiveDiceSixFacesRandom/>}
            </Button>
          <Button className="eyeSlashButton reset" onClick={() => handleResetBuild()}>
            {isWideScreen ? 'RESET BUILD' : <BiReset />}
            </Button>
          <Button className="eyeSlashButton display" onClick={() => setDisplayType((prevState) => !prevState)}>{displayType ? <CiGrid41/> : <CiBoxList/>}</Button>
          <Button className="eyeSlashButton" onClick={() => setShowTable((prevState) => !prevState)}>{showTable ? <FiEyeOff/> : <FiEye/>}</Button>
        </div>
</div>

    {showTable && Object.values(randomizedBuild).some(value => value != null && value !== "") && (
    <div className="build-title">
    {displayType ? (
    <Table className="randomBuildTable randomize-table">
      <tbody>
          {randomizedBuild.primaryGun &&
          <tr>
              <td>Primary Gun</td>
              <td>{randomizedBuild.primaryGun}</td>
          </tr>
          }
          {randomizedBuild.secondaryGun &&
          <tr>
              <td>Secondary Gun</td>
              <td>{randomizedBuild.secondaryGun}</td>
          </tr>
          }
          {randomizedBuild.perkDeck &&
          <tr>
              <td>Perk Deck</td>
              <td>{randomizedBuild.perkDeck}</td>
          </tr>
          }
          {randomizedBuild.armor &&
          <tr>
              <td>Armor</td>
              <td>{randomizedBuild.armor}</td>
          </tr>
          }
          {randomizedBuild.throwable &&
          <tr>
              <td>Throwable</td>
              <td>{randomizedBuild.throwable}</td>
          </tr>
          }
          {randomizedBuild.equipment &&
          <tr>
              <td>Equipment</td>
              <td>{randomizedBuild.equipment}</td>
          </tr>
          }
          {randomizedBuild.melee &&
          <tr>
              <td>Melee</td>
              <td>{randomizedBuild.melee}</td>
          </tr>
          }
      </tbody>
    </Table>)
    :
    (

<div className="grid-container">
{buildItems.map(({ key, title }) => {
  const item = randomizedBuild[key];
  const isLocked = selectedCategories.includes(key + 's');
  return (
    item && (
      <div
        key={key}
        className={`grid-item ${selectedItem === key ? 'selectedItem borderedRandomizer' : ''}`}
        onClick={() => handleItemClick(key)}
      >
        <div className={`grid-title ${selectedItem === key ? 'selectedItem' : ''}`}>
          {selectedItem === key ? item : title}
          
        </div>
        <img
          src={itemsToImage[item]}
          alt={item}
          className={`grid-image
            ${selectedItem === key ? 'selected' : ''}
            ${key === 'perkDeck' ? `perkDeck ${selectedItem === key ? 'perkDeck selected' : ''}` : ''}
            ${key === 'armor' ? `armor ${selectedItem === key ? 'armor selected' : ''}` : ''}`}
        />
        {/* Lock Icon */}
        <div
            className="lock-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLock(key);
            }}
          >
            {isLocked ? <FaLockOpen /> : <FaLock />}
          </div>
      </div>
    )
  );
})}
</div>
)}
  </div>
    )}
  </div>

  <div className="randomBuildContainer backgroundImage">
    {!isWideScreen && <div className="randomBuildContainer-title">HEIST</div>}
        <div className="buttons">
          <Button className={`${isWideScreen ? 'randomizeButton' : 'eyeSlashButton'}`} onClick={handleRandomizeHeist}>
            {isWideScreen ? 'RANDOMIZE HEIST' : <GiPerspectiveDiceSixFacesRandom/>}
            </Button>
          <Button className="eyeSlashButton reset" onClick={() => handleResetHeist()}>
            {isWideScreen ? 'RESET HEIST' : <BiReset />}
            </Button>
          <Button className="eyeSlashButton" onClick={() => setShowTableHeist((prevState) => !prevState)}>{showTableHeist ? <FiEyeOff/> : <FiEye/>}</Button>
        </div>

    {showTableHeist && randomizedHeist.heist && (
      <>
<div className="heist-title">
  {heists[randomizedHeist.heist]?.name || 'Unknown Heist'}
</div>
<img
  src={itemsToImage[randomizedHeist.heist]}
  alt={randomizedHeist.heist}
  className="heist-image"
/>
{/* <div className="heist-subtitle">
  {`Contractor: ${heists[randomizedHeist.heist]?.contractor || 'N/A'}`}
  <br />
  {`Days: ${heists[randomizedHeist.heist]?.days || 'N/A'}`}
  <br />
  {`Tactic: ${heists[randomizedHeist.heist]?.tactic || 'N/A'}`}
  <br />
  {`XP: ${removePrefix(heists[randomizedHeist.heist]?.xp || 'N/A')}`}
</div> */}
<div className="heist-subtitle grid-container">
  
  {/* HEIST CONTRACTOR */}
  <div className="contractor">{heists[randomizedHeist.heist]?.contractor || 'N/A'}</div>

  {/* HEIST DAYS */}
  <div className="days">
    {(() => {
      const days = heists[randomizedHeist.heist]?.days;
      let clockComponent = null;
      if (days === 1) {
        clockComponent = <Clock duration={10} className="clock" />;
      } else if (days === 2) {
        clockComponent = <Clock duration={25} className="clock" />;
      } else if (days === 3) {
        clockComponent = <Clock duration={40} className="clock" />;
      }
      return (
        <>
          <span>{clockComponent}</span>
          <span className="clock-text">{`${days || 'N/A'} ${days === 1 ? 'day' : 'days'}`}</span>
        </>
      );
    })()}
  </div>

  {/* HEIST BASE XP */}
  <div className="xp">{`${removePrefix(heists[randomizedHeist.heist]?.xp || 'N/A')} BASE XP`}</div>

  {/* HEIST TACTIC */}
  {/* <div>{heists[randomizedHeist.heist]?.tactic || 'N/A'}</div> */}
  <div className="tactic">
    {(() => {
      const tactic = heists[randomizedHeist.heist]?.tactic;
      let iconComponent = null;

      if (tactic === 'Stealth possible') {
        iconComponent = <PiGhost className="ghost" />;
      } else if (tactic === 'Stealth only') {
        iconComponent = <PiGhostFill className="ghost" />;
      }

      return (
        <>
          <span>{iconComponent}</span>
          <span className="ghost-text">{tactic || 'N/A'}</span>
        </>
      );
    })()}
  </div>

</div>





      
      </>
    
    
    )}
  </div>

  <div className="randomBuildContainer backgroundImage">
    {!isWideScreen && <div className="randomBuildContainer-title">PROFILE</div>}
        <div className="buttons">
          <Button className={`${isWideScreen ? 'randomizeButton' : 'eyeSlashButton'}`} onClick={handleRandomizeProfile}>
            {isWideScreen ? 'RANDOMIZE PROFILE' : <GiPerspectiveDiceSixFacesRandom/>}
            </Button>
          <Button className="eyeSlashButton reset" onClick={() => handleResetProfile()}>
            {isWideScreen ? 'RESET PROFILE' : <BiReset />}
            </Button>
          <Button className="eyeSlashButton" onClick={() => setShowTableProfile((prevState) => !prevState)}>{showTableProfile ? <FiEyeOff/> : <FiEye/>}</Button>
        </div>

        {showTableProfile && randomizedProfile && (
  <>
    <div className="profile-grid-container">
      
      {/* Always render the profileName */}
      <div className="profile-grid-item number">
        <div className="profile-grid-title number">{randomizedProfile.profileName}</div>
      </div>

      {/* Conditionally render the rest of the profile details */}
      {randomizedProfile.perkDeck && (
        <div className="profile-grid-item">
          <div className="profile-grid-content">
            <div className="profile-grid-title">PERK DECK</div>
            <div className="profile-grid-name">{randomizedProfile.perkDeck}</div>
          </div>
        </div>
      )}

      {randomizedProfile.primaryWeapon && (
        <div className="profile-grid-item" onClick={() => handleModsToggle("primary")}>
          <div className="profile-grid-content">
            <div className="profile-grid-title">PRIMARY</div>
            <div className="profile-grid-name">{randomizedProfile.primaryWeapon}</div>
          </div>
        </div>
      )}

      {randomizedProfile.primaryWeaponMods && randomizedProfile.primaryWeaponMods.length > 0 && showModsPrimary && (
            <div className="mods-grid randomizer">
              {randomizedProfile.primaryWeaponMods.map(([modCategory, modValue], index) => (
                <React.Fragment key={index}>
                  <div className="profile-grid-title mods">{modCategoryNames[modCategory] || modCategory}</div>
                  <div className="profile-grid-name mods">{modValue}</div>
                </React.Fragment>
              ))}
            </div>
          )}
          
      {randomizedProfile.secondaryWeapon && (
        <div className="profile-grid-item" onClick={() => handleModsToggle("secondary")}>
          <div className="profile-grid-content">
            <div className="profile-grid-title">SECONDARY</div>
            <div className="profile-grid-name">{randomizedProfile.secondaryWeapon}</div>
          </div>
        </div>
      )}

      {randomizedProfile.secondaryWeaponMods && randomizedProfile.secondaryWeaponMods.length > 0 && showModsSecondary && (
                  <div className="mods-grid randomizer">
                    {randomizedProfile.secondaryWeaponMods.map(([modCategory, modValue], index) => (
                      <React.Fragment key={index}>
                        <div className="profile-grid-title mods">{modCategoryNames[modCategory] || modCategory}</div>
                        <div className="profile-grid-name mods">{modValue}</div>
                      </React.Fragment>
                    ))}
                  </div>
                )}

      {randomizedProfile.melee && (
        <div className="profile-grid-item">
          <div className="profile-grid-content">
            <div className="profile-grid-title">MELEE</div>
            <div className="profile-grid-name">{randomizedProfile.melee}</div>
          </div>
        </div>
      )}

      {randomizedProfile.throwable && (
        <div className="profile-grid-item">
          <div className="profile-grid-content">
            <div className="profile-grid-title">THROWABLE</div>
            <div className="profile-grid-name">{randomizedProfile.throwable}</div>
          </div>
        </div>
      )}

      {randomizedProfile.armor && (
        <div className="profile-grid-item">
          <div className="profile-grid-content">
            <div className="profile-grid-title">ARMOR</div>
            <div className="profile-grid-name">{randomizedProfile.armor}</div>
          </div>
        </div>
      )}

      {randomizedProfile.equipment && (
        <div className="profile-grid-item">
          <div className="profile-grid-content">
            <div className="profile-grid-title">EQUIPMENT</div>
            <div className="profile-grid-name">{randomizedProfile.equipment}</div>
          </div>
        </div>
      )}

      {randomizedProfile.tags && randomizedProfile.tags.length > 0 && (
        // <div className="profile-grid-item">
        //   <div className="profile-grid-content">
        //     <div className="profile-grid-title">TAGS</div>
        //     <div className="profile-grid-name">{randomizedProfile.tags.join(', ')}</div>
        //   </div>
        // </div>
        <div className="profile-grid-item">
        <div className="profile-grid-content">
          <div className="profile-grid-title">TAGS</div>
        </div>
        {renderTagsGrid(randomizedProfile.tags)}
      </div>
      )}
    </div>
  </>
)}

  </div>

<div className="separator"></div>

<Accordion className="configuration-accordion">
<Accordion.Item eventKey="0">
<Accordion.Header onClick={toggleAccordion} className={`configuration-header ${isOpen ? "open" : "closed"}`}>
{isOpen ? 'CLOSE CONFIGURATION' : 'OPEN CONFIGURATION'}
</Accordion.Header>
<Accordion.Body>
        

{/* <Button onClick={toggleConfig}>
        {configActive ? "Close configuration" : "Open configuration"}
      </Button> */}
{/* <div className={`container configuration ${configActive ? "active" : ""}`}> */}
<div className="container configuration">
    
<SelectCategories
  categories={categories.filter(category => category.key !== "heists")}
  selectedCategories={selectedCategories}
  collapsed={collapsed}
  toggleCollapse={toggleCollapse}
  handleToggleCategory={handleToggleCategory}
  handleToggleSelectedCategories={handleToggleSelectedCategories}
  isCheckboxMode={isCheckboxMode}
  toggleMode={toggleMode}
  randomizedBuild={randomizedBuild}
/>

{/* <div className={`separator internal ${!collapsed.selectedCategories ? "green" : "red"}`} style={{marginTop: 10, marginBottom: 20}}></div> */}
<div className="separator" style={{marginTop: 10, marginBottom: 20}}></div>
    
    <div className="buttons expand-uncheck">

      {/* <Button className="expandAllCategoriesButton" onClick={toggleAllCollapse}>
        {!collapsed.all ? (<VscCollapseAll/>) : (<VscExpandAll/>)}
        {!collapsed.all ? " Collapse All" : " Expand All"}
      </Button> */}

      <Button className="checkUncheckAllCategoriesButton" onClick={() => handleToggleCheckAllCategories()}>
        {Object.keys(selectedOptions).every(category => 
          selectedOptions[category].length === Object.values(options[category]).flat().length
        ) ? (
        <><ImCheckboxChecked /> Uncheck All Items</>
        ) : (
        <><ImCheckboxUnchecked /> Check All Items</>
        )}
      </Button>

    </div>

    <Accordion>
      {Object.keys(options)
        .filter((category) => !excludedCategories.includes(category)) // Exclude specified categories
        .map((category, index) => (
          <Card key={category}>
            <Card.Header
              ref={(el) => (refs.current[category] = { current: el })}
              className={`form-title stickyDiv ${stickyStates[category] && !collapsed[category] ? 'stickyCategory' : ''} ${!collapsed[category] ? "selectedCategories" : "collapsed"} ${areAllItemsCheckedInCategory(category) ? "" : "none-selected"}`}
            >
              <div className="card-header-flex">
                <CustomToggle
                  eventKey={String(index)}
                  category={category}
                >
                  {categories.find((cat) => cat.key === category)?.label || category}
                </CustomToggle>

                {!collapsed[category] && (
                  <Button
                    className="eyeSlashButton toggleModeForm"
                    onClick={() => handleToggleCheckAllInCategory(category)}
                  >
                    {areAllItemsCheckedInCategory(category) ? "Uncheck all " : "Check all "}
                  </Button>
                )}
              </div>
            </Card.Header>

            <Accordion.Collapse eventKey={String(index)}>
              <Card.Body>
                {category === "primaryGuns" || category === "secondaryGuns" ? (
                  <Accordion className="card-body guns">
                    {Object.keys(options[category]).map((subcategory, subIndex) => (
                      <Card key={subcategory}>
                        <Card.Header className="form-items">
                          <SubcategoryToggle
                            eventKey={String(subIndex)}
                            category={category}
                            subcategory={subcategory}
                          >
                            {subcategories.find((cat) => cat.key === subcategory)?.label || subcategory}
                          </SubcategoryToggle>

                          <div className="form-items">
                            <Form.Check
                              type="checkbox"
                              className="subcategory-checkbox"
                              ref={(input) => {
                                if (input) {
                                  const totalItems = options[category][subcategory].length;
                                  const selectedItems = selectedOptions[category].filter((item) =>
                                    options[category][subcategory].includes(item)
                                  ).length;

                                  // Set the indeterminate property
                                  input.indeterminate =
                                    selectedItems > 0 && selectedItems < totalItems;
                                }
                              }}
                              checked={
                                selectedOptions[category].filter((item) =>
                                  options[category][subcategory].includes(item)
                                ).length === options[category][subcategory].length
                              }
                              onChange={() => handleToggleCheckAll(category, subcategory)}
                            />
                          </div>
                        </Card.Header>

                        <Accordion.Collapse eventKey={String(subIndex)}>
                          <Card.Body>
                            {/* Only show items if subcategory is expanded */}
                            {options[category][subcategory].map((item) => (
                              <Form.Check
                                type="checkbox"
                                label={item}
                                id={item}
                                key={item}
                                value={item}
                                checked={selectedOptions[category].includes(item)}
                                onChange={(e) =>
                                  handleOptionChange(category, item, e.target.checked)
                                }
                              />
                            ))}
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    ))}
                  </Accordion>
                ) : category === 'heists' ? (
                  <>
                    
                      <Accordion defaultActiveKey="">
                          <Accordion.Item>
                          <Accordion.Header className="sorting-label">GROUP BY</Accordion.Header>
                          <Accordion.Body className="sorting-controls">
                            <Button onClick={() => handleSortChange('name')} className={`${sortCriteria === 'name' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Name</Button>
                            <Button onClick={() => handleSortChange('contractor')} className={`${sortCriteria === 'contractor' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Contractor</Button>
                            <Button onClick={() => handleSortChange('days')} className={`${sortCriteria === 'days' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Days</Button>
                            <Button onClick={() => handleSortChange('tactic')} className={`${sortCriteria === 'tactic' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Tactic</Button>
                            <Button onClick={() => handleSortChange('xp')} className={`${sortCriteria === 'xp' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Base XP</Button>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    
                    {sortCriteria === 'days' || sortCriteria === 'contractor' || sortCriteria === 'tactic' || sortCriteria === 'xp' ? (
                      <Accordion className="card-body guns">
                        {subcategoriesHeist.map((subcat, subIndex) => (
                          <Card key={subcat}>
                            <Card.Header className="form-items">
                              <SubcategoryToggle
                                eventKey={String(subIndex)}
                                category={category}
                                subcategory={subcat}
                              >
                              {
                                sortCriteria === 'days' ? (
                                  <>{subcat} {subcat === 1 ? 'day' : 'days'}</>
                                ) : (
                                  <>{removePrefix(subcat)}</>
                                )
                              }
                              </SubcategoryToggle>

                              <div className="form-items">
                                <Form.Check
                                  type="checkbox"
                                  className="subcategory-checkbox"
                                  ref={(input) => {
                                    if (input) {
                                      const totalItems = sortedHeists.filter((heist) => heists[heist][sortCriteria] === subcat).length;
                                      const selectedItems = selectedOptions.heists.filter((item) =>
                                        sortedHeists.includes(item) && heists[item][sortCriteria] === subcat
                                      ).length;

                                      // Set the indeterminate property
                                      input.indeterminate =
                                        selectedItems > 0 && selectedItems < totalItems;
                                    }
                                  }}
                                  checked={
                                    selectedOptions.heists.filter((item) =>
                                      heists[item][sortCriteria] === subcat
                                    ).length ===
                                    sortedHeists.filter((heist) => heists[heist][sortCriteria] === subcat).length
                                  }
                                  onChange={() => handleToggleCheckAll(category, subcat)}
                                />
                              </div>
                            </Card.Header>

                            <Accordion.Collapse eventKey={String(subIndex)}>
                              <Card.Body>
                                {/* Only show items if subcategory is expanded */}
                                {sortedHeists
                                .filter((heist) => heists[heist][sortCriteria] === subcat)
                                .sort((a, b) => {return heists[a].name.localeCompare(heists[b].name);})
                                .map((heistKey) => (
                                  <Form.Check
                                    type="checkbox"
                                    label={heists[heistKey]?.name || 'Unknown Heist'}
                                    id={heistKey}
                                    key={heistKey}
                                    value={heistKey}
                                    checked={selectedOptions.heists.includes(heistKey)}
                                    onChange={(e) =>
                                      handleOptionChange('heists', heistKey, e.target.checked)
                                    }
                                  />
                                ))}
                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="heist-list">
                        {sortedHeists.map((heistKey) => (
                          <Form.Check
                            type="checkbox"
                            label={heists[heistKey]?.name || 'Unknown Heist'}
                            id={heistKey}
                            key={heistKey}
                            value={heistKey}
                            checked={selectedOptions.heists.includes(heistKey)}
                            onChange={(e) =>
                              handleOptionChange('heists', heistKey, e.target.checked)
                            }
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : category === 'profiles' ? (
                  // Special handling for profiles
<>
  {/* Sorting Controls */}
  <Accordion defaultActiveKey="">
    <Accordion.Item>
      <Accordion.Header className="sorting-label">GROUP BY</Accordion.Header>
      <Accordion.Body className="sorting-controls">
        <Button onClick={() => handleProfileSortChange('profileName')} className={`${sortProfileCriteria === 'profileName' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Name</Button>
        <Button onClick={() => handleProfileSortChange('tags')} className={`${sortProfileCriteria === 'tags' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Tags</Button>
        <Button onClick={() => handleProfileSortChange('perkDeck')} className={`${sortProfileCriteria === 'perkDeck' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Perk Deck</Button>
        <Button onClick={() => handleProfileSortChange('primaryWeapon')} className={`${sortProfileCriteria === 'primaryWeapon' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Primary</Button>
        <Button onClick={() => handleProfileSortChange('secondaryWeapon')} className={`${sortProfileCriteria === 'secondaryWeapon' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Secondary</Button>
        <Button onClick={() => handleProfileSortChange('melee')} className={`${sortProfileCriteria === 'melee' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Melee</Button>
        <Button onClick={() => handleProfileSortChange('throwable')} className={`${sortProfileCriteria === 'throwable' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Throwable</Button>
        <Button onClick={() => handleProfileSortChange('armor')} className={`${sortProfileCriteria === 'armor' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Armor</Button>
        <Button onClick={() => handleProfileSortChange('equipment')} className={`${sortProfileCriteria === 'equipment' ? 'sortingKey' : 'sortingKeyUnselected'}`}>Equipment</Button>
        {/* Add buttons for other properties you want to sort by */}
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>

  {/* Filtered Profiles Display */}
  {Array.isArray(options.profiles) ? (
    sortProfileCriteria === 'tags' ||
    sortProfileCriteria === 'perkDeck' ||
    sortProfileCriteria === 'primaryWeapon' ||
    sortProfileCriteria === 'secondaryWeapon' ||
    sortProfileCriteria === 'melee' ||
    sortProfileCriteria === 'throwable' ||
    sortProfileCriteria === 'armor' ||
    sortProfileCriteria === 'equipment'
    ? (
      <Accordion className="card-body profiles">
        {sortProfileCriteria === 'tags' ? (
          // Unique Tags Rendering
          [...new Set(options.profiles.flatMap(profile => profile.tags))]
          .filter(tag => tag !== "No data available")
          .map((tag, subIndex) => (
            <Card key={tag}>
              <Card.Header className="form-items">
                <ProfilesToggle
                  eventKey={String(subIndex)}
                  category="profiles"
                  subcategory={tag}
                >
                  {tag}
                </ProfilesToggle>

                <div className="form-items">
                  <Form.Check
                    type="checkbox"
                    className="subcategory-checkbox"
                    ref={(input) => {
                      if (input) {
                        const totalProfiles = options.profiles.filter(profile => profile.tags.includes(tag)).length;
                        const selectedProfiles = selectedOptions.profiles.filter(selectedProfile =>
                          options.profiles.some(profile =>
                            profile.profileName === selectedProfile.profileName &&
                            profile.tags.includes(tag)
                          )
                        ).length;

                        input.indeterminate = selectedProfiles > 0 && selectedProfiles < totalProfiles;
                      }
                    }}
                    checked={selectedOptions.profiles.filter(profile =>
                      profile.tags.includes(tag)
                    ).length === options.profiles.filter(profile => profile.tags.includes(tag)).length}
                    onChange={() => handleToggleCheckAll('profiles', tag)}
                  />
                </div>
              </Card.Header>

              <Accordion.Collapse eventKey={String(subIndex)}>
                <Card.Body>
                  {options.profiles
                    .filter(profile => profile.tags.includes(tag))
                    .map((profile, index) => (
                      <Form.Check
                        type="checkbox"
                        label={profile.profileName}
                        id={`profile-${index}`}
                        key={profile.profileName}
                        value={profile.profileName}
                        checked={selectedOptions.profiles.some(
                          (selectedProfile) => selectedProfile.profileName === profile.profileName
                        )}
                        onChange={(e) => handleOptionChange('profiles', profile, e.target.checked)}
                      />
                    ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))
        ) : (
          // Existing logic for other criteria
          sortedProfilesByProperty.map((propertyValue, subIndex) => (
            <Card key={propertyValue}>
              <Card.Header className="form-items">
                <ProfilesToggle
                  eventKey={String(subIndex)}
                  category="profiles"
                  subcategory={propertyValue}
                >
                  {propertyValue}
                </ProfilesToggle>

                <div className="form-items">
                  <Form.Check
                    type="checkbox"
                    className="subcategory-checkbox"
                    ref={(input) => {
                      if (input) {
                        const totalProfiles = sortedProfiles.filter(profile => profile[sortProfileCriteria] === propertyValue).length;
                        const selectedProfiles = selectedOptions.profiles.filter(selectedProfile =>
                          sortedProfiles.some(profile =>
                            profile.profileName === selectedProfile.profileName &&
                            profile[sortProfileCriteria] === propertyValue
                          )
                        ).length;

                        input.indeterminate = selectedProfiles > 0 && selectedProfiles < totalProfiles;
                      }
                    }}
                    checked={selectedOptions.profiles.filter(profile =>
                      sortedProfiles.some(sortedProfile => sortedProfile.profileName === profile.profileName && sortedProfile[sortProfileCriteria] === propertyValue)
                    ).length === sortedProfiles.filter(profile => profile[sortProfileCriteria] === propertyValue).length}
                    onChange={() => handleToggleCheckAll('profiles', propertyValue)}
                  />
                </div>
              </Card.Header>

              <Accordion.Collapse eventKey={String(subIndex)}>
                <Card.Body>
                  {sortedProfiles
                    .filter(profile => profile[sortProfileCriteria] === propertyValue)
                    .map((profile, index) => (
                      <Form.Check
                        type="checkbox"
                        label={profile.profileName}
                        id={`profile-${index}`}
                        key={profile.profileName}
                        value={profile.profileName}
                        checked={selectedOptions.profiles.some(
                          (selectedProfile) => selectedProfile.profileName === profile.profileName
                        )}
                        onChange={(e) => handleOptionChange('profiles', profile, e.target.checked)}
                      />
                    ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))
        )}
      </Accordion>
    ) : (
      options.profiles.map((profile, index) => (
        <Form.Check
          type="checkbox"
          label={profile.profileName}
          id={`profile-${index}`}
          key={profile.profileName}
          value={profile.profileName}
          checked={selectedOptions.profiles.some(
            (selectedProfile) => selectedProfile.profileName === profile.profileName
          )}
          onChange={(e) => handleOptionChange('profiles', profile, e.target.checked)}
        />
      ))
    )
  ) : (
    <div>No profiles available</div>
  )}
</>




                ) : (
                  // Handle categories without subcategories (e.g., perkDecks)
                  Object.keys(options[category]).map((subcategory) =>
                    options[category][subcategory].map((item) => (
                      <Form.Check
                        type="checkbox"
                        label={item}
                        id={item}
                        key={item}
                        value={item}
                        checked={selectedOptions[category].includes(item)}
                        onChange={(e) =>
                          handleOptionChange(category, item, e.target.checked)
                        }
                      />
                    ))
                  )
                )}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
    </Accordion>



{/* <div>{heistOptions}</div> */}


 
  </div>
  </Accordion.Body>
      </Accordion.Item>
    </Accordion>

</div>
);
};

export default Payday2Randomizer;