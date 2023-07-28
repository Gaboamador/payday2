import React, { useEffect, useState, useRef } from "react";
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"
import '../App.css';

const categoryNames = {
    perkDeck: "PERK DECK",
    antiSpecials: "ANTI-SPECIALS",
    support: "SUPPORT",
    deployable: "DEPLOYABLE",
    buildType: "BUILD TYPE",
    activeMechanics: "ACTIVE MECHANICS",
    primaryType: "PRIMARY TYPE",
    secondaryType: "SECONDARY TYPE",
    melee: "MELEE",
    throwable: "THROWABLE",
    armor: "ARMOR",
    detectionRisk: "DETECTION RISK",
  };
  
  // const profiles = {
  //   1: [
  //       { perkDeck: ['Stoic'] },
  //       { antiSpecials: ['Shield','Bulldozer','Captain Winters','SWAT Turret'] },
  //       { support: ['Transporter','Drill Sawgeant'] },
  //       { deployable: ['First Aid Kit'] },
  //       { buildType: ['Tank'] },
  //       { activeMechanics: ['Jokers (2)','Hostage Taker','Nine Lives'] },
  //       { primaryType: ['Light Machine Gun'] },
  //       { secondaryType: ['Grenade Launcher'] },
  //       { melee: ['Buzzer'] },
  //       { throwable: ['Deck specific'] },
  //       { armor: ['Ballistic/Heav./Comb. Vest'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       2: [
  //       { perkDeck: ['Kingpin'] },
  //       { antiSpecials: ['Shield','Bulldozer','Captain Winters'] },
  //       { support: ['Transporter','Drill Sawgeant'] },
  //       { deployable: ['First Aid Kit'] },
  //       { buildType: ['Tank'] },
  //       { activeMechanics: ['Jokers (2)','Hostage Taker','High Value Target','Nine Lives'] },
  //       { primaryType: ['Sniper Rifle'] },
  //       { secondaryType: ['Submachine Gun'] },
  //       { melee: ['Buzzer'] },
  //       { throwable: ['Deck specific'] },
  //       { armor: ['Ballistic/Heav./Comb. Vest'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       3: [
  //       { perkDeck: ['Muscle'] },
  //       { antiSpecials: ['Shield'] },
  //       { support: ['Transporter','Bulletstorm','OVE9000','Drill Sawgeant'] },
  //       { deployable: ['Ammo Bag'] },
  //       { buildType: ['Tank'] },
  //       { activeMechanics: ['Jokers (2)','Hostage Taker','Nine Lives'] },
  //       { primaryType: ['Minigun'] },
  //       { secondaryType: ['Shotgun'] },
  //       { melee: ['Buzzer'] },
  //       { throwable: ['Explosive throwable'] },
  //       { armor: ['Ballistic/Heav./Comb. Vest'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       4: [
  //       { perkDeck: ['Crew Chief'] },
  //       { antiSpecials: ['Shield','Bulldozer','Captain Winters'] },
  //       { support: ['Inspire','Transporter','Drill Sawgeant'] },
  //       { deployable: ['First Aid Kit'] },
  //       { buildType: ['Tank'] },
  //       { activeMechanics: ['Jokers (2)','Hostage Taker','High Value Target','Nine Lives'] },
  //       { primaryType: ['Sniper Rifle'] },
  //       { secondaryType: ['Shotgun','Grenade Launcher'] },
  //       { melee: ['Buzzer'] },
  //       { throwable: ['Impact throwable'] },
  //       { armor: ['ICTV'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       5: [
  //       { perkDeck: ['Maniac'] },
  //       { antiSpecials: ['Shield','Bulldozer','Captain Winters','SWAT Turret'] },
  //       { support: ['Transporter','Drill Sawgeant'] },
  //       { deployable: ['Sentry Gun','Suppressed Sentry Gun'] },
  //       { buildType: ['Tank'] },
  //       { activeMechanics: ['Jokers (2)','Hostage Taker','Nine Lives'] },
  //       { primaryType: ['Light Machine Gun'] },
  //       { secondaryType: ['Grenade Launcher'] },
  //       { melee: ['Buzzer'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['Ballistic/Heav./Comb. Vest'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       6: [
  //       { perkDeck: ['Grinder'] },
  //       { antiSpecials: ['Shield','Captain Winters'] },
  //       { support: ['Transporter','Drill Sawgeant'] },
  //       { deployable: ['Sentry Gun','Suppressed Sentry Gun'] },
  //       { buildType: ['Health regen'] },
  //       { activeMechanics: ['Jokers (1)','High Value Target','Nine Lives'] },
  //       { primaryType: ['Akimbo Shotgun'] },
  //       { secondaryType: ['Grenade Launcher'] },
  //       { melee: ['Other'] },
  //       { throwable: ['Impact throwable'] },
  //       { armor: ['Lightweight Ball. Vest'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       7: [
  //       { perkDeck: ['Sociopath'] },
  //       { antiSpecials: ['Shield','Bulldozer','Captain Winters','SWAT Turret'] },
  //       { support: ['Transporter','Bulletstorm'] },
  //       { deployable: ['Ammo Bag'] },
  //       { buildType: ['Armor gating'] },
  //       { activeMechanics: ['Jokers (1)','Nine Lives'] },
  //       { primaryType: ['Assault Rifle'] },
  //       { secondaryType: ['Rocket Launcher'] },
  //       { melee: ['Shinsakuto Katana'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['ICTV'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       8: [
  //       { perkDeck: ['Gambler'] },
  //       { antiSpecials: ['Bulldozer'] },
  //       { support: ['Transporter','Bulletstorm','Drill Sawgeant','Shaped charges'] },
  //       { deployable: ['Ammo Bag','Trip Mines and Shaped Charges'] },
  //       { buildType: ['Health regen'] },
  //       { activeMechanics: ['Jokers (1)','Nine Lives'] },
  //       { primaryType: ['Assault Rifle'] },
  //       { secondaryType: ['Submachine Gun'] },
  //       { melee: ['Ice Pick'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['Two-Piece Suit'] },
  //       { detectionRisk: ['16 - 28'] },
  //       ],
  //       9: [
  //       { perkDeck: ['Ex-President'] },
  //       { antiSpecials: ['Shield','Bulldozer'] },
  //       { support: ['Transporter','Bulletstorm','Drill Sawgeant'] },
  //       { deployable: ['Ammo Bag'] },
  //       { buildType: ['Armor gating'] },
  //       { activeMechanics: ['Jokers (1)','Nine Lives'] },
  //       { primaryType: ['Akimbo SMG'] },
  //       { secondaryType: ['Submachine Gun'] },
  //       { melee: ['Ice Pick'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['Lightweight Ball. Vest'] },
  //       { detectionRisk: ['16 - 28'] },
  //       ],
  //       10: [
  //       { perkDeck: ['Armorer'] },
  //       { antiSpecials: ['Shield','Bulldozer','Captain Winters'] },
  //       { support: ['Transporter','Drill Sawgeant'] },
  //       { deployable: ['Doctor Bag'] },
  //       { buildType: ['Tank'] },
  //       { activeMechanics: ['Nine Lives'] },
  //       { primaryType: ['Sniper Rifle'] },
  //       { secondaryType: ['Submachine Gun'] },
  //       { melee: ['Shinsakuto Katana'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['ICTV'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       11: [
  //       { perkDeck: ['Anarchist'] },
  //       { antiSpecials: ['Shield','Bulldozer'] },
  //       { support: ['Inspire'] },
  //       { deployable: ['Doctor Bag'] },
  //       { buildType: ['Armor gating'] },
  //       { activeMechanics: ['Jokers (1)','Nine Lives'] },
  //       { primaryType: ['Shotgun'] },
  //       { secondaryType: ['Shotgun'] },
  //       { melee: ['Other'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['Two-Piece Suit'] },
  //       { detectionRisk: ['3 - 15'] },
  //       ],
  //       12: [
  //       { perkDeck: ['Hitman'] },
  //       { antiSpecials: ['Shield','Bulldozer'] },
  //       { support: ['Transporter'] },
  //       { deployable: ['Ammo Bag'] },
  //       { buildType: ['Armor gating'] },
  //       { activeMechanics: ['High Value Target'] },
  //       { primaryType: ['Akimbo Shotgun'] },
  //       { secondaryType: ['Shotgun'] },
  //       { melee: ['Shinsakuto Katana'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['ICTV'] },
  //       { detectionRisk: ['29 - 75'] },
  //       ],
  //       13: [
  //       { perkDeck: ['Crook'] },
  //       { antiSpecials: [] },
  //       { support: ['Transporter'] },
  //       { deployable: ['Doctor Bag'] },
  //       { buildType: ['Dodge'] },
  //       { activeMechanics: ['Jokers (1)','Nine Lives'] },
  //       { primaryType: ['Akimbo Pistol'] },
  //       { secondaryType: ['Pistol'] },
  //       { melee: ['Buzzer'] },
  //       { throwable: ['Concussion Grenade'] },
  //       { armor: ['Lightweight Ball. Vest'] },
  //       { detectionRisk: ['16 - 28'] },
  //       ],
  //       14: [
  //       { perkDeck: ['Hacker'] },
  //       { antiSpecials: ['Bulldozer'] },
  //       { support: ['Transporter'] },
  //       { deployable: ['First Aid Kit'] },
  //       { buildType: ['Dodge'] },
  //       { activeMechanics: ['Jokers (1)','Nine Lives'] },
  //       { primaryType: ['Assault Rifle'] },
  //       { secondaryType: ['Submachine Gun'] },
  //       { melee: ['Other'] },
  //       { throwable: ['Deck specific'] },
  //       { armor: ['Two-Piece Suit'] },
  //       { detectionRisk: ['16 - 28'] },
  //       ],
  //       15: [
  //       { perkDeck: ['Sicario'] },
  //       { antiSpecials: ['Shield','Bulldozer'] },
  //       { support: ['Transporter','Drill Sawgeant'] },
  //       { deployable: ['First Aid Kit'] },
  //       { buildType: ['Dodge'] },
  //       { activeMechanics: ['Jokers (2)','Hostage Taker','Nine Lives'] },
  //       { primaryType: ['Akimbo Pistol'] },
  //       { secondaryType: ['Pistol'] },
  //       { melee: ['Shinsakuto Katana'] },
  //       { throwable: ['Deck specific'] },
  //       { armor: ['Two-Piece Suit'] },
  //       { detectionRisk: ['3 - 15'] },
  //       ],
  // };
  

const BuildSelector = () => {
    
      useEffect(() => {
        
      }, []);

      
      // const [profiles, setProfiles] = useState({});

      // const handleFileChange = (event) => {
      //   const file = event.target.files[0];
      //   const reader = new FileReader();
    
      //   reader.onload = (e) => {
      //     try {
      //       const data = JSON.parse(e.target.result);
      //       setProfiles(data);
      //     } catch (error) {
      //       console.error("Error parsing JSON file:", error);
      //     }
      //   };
    
      //   reader.readAsText(file);
      //   console.log(profiles)
      // };

      const fileInputRef = useRef(null);

      const [loadedData, setLoadedData] = useState(null);


      const loadFile = (file) => {
        if (file) {
        setFilteredProfiles([])
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            setLoadedData(data);
            localStorage.setItem("profiles", JSON.stringify(data));
          } catch (error) {
            console.error("Error parsing JSON file:", error);
          }
        };
        reader.readAsText(file);
      }
      };
      
      const storedProfiles = localStorage.getItem("profiles");
      const profiles = loadedData || (storedProfiles ? JSON.parse(storedProfiles) : {});
      
      const [selectedItems, setSelectedItems] = useState({});
      const [filterMode, setFilterMode] = useState('and');
      const [filteredProfiles, setFilteredProfiles] = useState([]);
    
      const handleCheckboxChange = (category, item) => {
        setSelectedItems(prevSelectedItems => {
          const newSelectedItems = { ...prevSelectedItems };
          if (!newSelectedItems[category]) {
            newSelectedItems[category] = { [item]: true };
          } else {
            newSelectedItems[category] = {
              ...newSelectedItems[category],
              [item]: !newSelectedItems[category]?.[item],
            };
            if (Object.keys(newSelectedItems[category]).every(key => !newSelectedItems[category][key])) {
              delete newSelectedItems[category];
            }
          }
          return newSelectedItems;
        });
      };
      
    
      const toggleFilterMode = () => {
        setFilterMode(prevMode => (prevMode === 'and' ? 'or' : 'and'));
      };

  // Function to generate category checkboxes dynamically
  const renderCategoryCheckboxes = () => {
    const allItems = {};
    Object.keys(profiles).forEach(profileId => {
      profiles[profileId].forEach(profile => {
        Object.keys(profile).forEach(category => {
          const items = profile[category];
          if (items) {
            if (!allItems[category]) allItems[category] = {};
            items.forEach(item => {
              allItems[category][item] = true;
            });
          }
        });
      });
    });
  
    return Object.keys(categoryNames).map(category => (
        
      // Category section
        <div key={category} className="category-section">
          
          {/* // Category name */}
          <div className="category-name" onClick={() => toggleCategoryVisibility(category)}>
            {categoryNames[category]}
          </div>

          {/* Category items */}
          <div style={{ display: categoryVisibility[category] ? 'block' : 'none' }} className="category-checkbox-container">
            {Object.keys(allItems[category] || {}).map(item => (
              <label key={`${category}-${item}`} className="category-label">
                <input
                  type="checkbox"
                  checked={selectedItems[category]?.[item] || false}
                  onChange={() => handleCheckboxChange(category, item)}
                />
                {item}
              </label>
            ))}
          </div>

        </div>
      ));
    };
  
    
  const filterProfiles = () => {
    const selectedItemsArray = Object.entries(selectedItems)
      .map(([category, items]) => Object.entries(items).map(([item, checked]) => ({ category, item, checked })))
      .flat();
  
    const isAndFilter = filterMode === 'and';
  
    const filteredProfilesData = {};
  
    for (const profile in profiles) {
      const profileCategories = profiles[profile];
      let shouldDisplay = isAndFilter ? true : false;
  
      selectedItemsArray.forEach(item => {
        const { category, item: selectedItem, checked } = item;
  
        if (checked) {
          const categoryData = profileCategories.find(categoryItem => category in categoryItem);
          const items = categoryData?.[category] || [];
  
          if (isAndFilter && !items.includes(selectedItem)) {
            shouldDisplay = false;
          } else if (!isAndFilter && items.includes(selectedItem)) {
            shouldDisplay = true;
          }
        }
      });
  
      if (shouldDisplay) {
        filteredProfilesData[profile] = profiles[profile];
      }
    }
  
    setFilteredProfiles(filteredProfilesData);
  };

  useEffect(() => {
    filterProfiles();
  }, [selectedItems, filterMode]);

// TOGGLE VISIBILITY OF A SPECIFIC CATEGORY
const [categoryVisibility, setCategoryVisibility] = useState(() => {
  const initialVisibility = {};
  Object.keys(categoryNames).forEach(category => {
    initialVisibility[category] = true;
  });
  return initialVisibility;
});

const toggleCategoryVisibility = (category) => {
  setCategoryVisibility(prevVisibility => ({
    ...prevVisibility,
    [category]: !prevVisibility[category],
  }));
};

const [anyCategoryVisible, setAnyCategoryVisible] = useState();

const toggleAllCategoriesVisibility = () => {
  setCategoryVisibility(prevVisibility => {
    const anyCategoryVisible = Object.values(prevVisibility).includes(true);
    setAnyCategoryVisible(anyCategoryVisible)
    const updatedVisibility = {};
    Object.keys(prevVisibility).forEach(category => {
      updatedVisibility[category] = !anyCategoryVisible;
    });
    return updatedVisibility;
  }
  );
};
const toggleButtonText = !anyCategoryVisible ? "Hide All Categories" : "Show All Categories";

      return (
        <div>

      <div className="container">
      <div className="buttons">
      <Button onClick={() => fileInputRef.current.click()}>Load</Button>
      <input
      type="file"
      accept=".json"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={(e) => loadFile(e.target.files[0])}
      />

      <Button onClick={toggleAllCategoriesVisibility}>
        {toggleButtonText}
      </Button>
      
        <Button onClick={toggleFilterMode}>
          Filter Mode: {filterMode === 'and' ? 'AND' : 'OR'}
        </Button>
      </div>
      </div>
      {renderCategoryCheckboxes()}
      <div className="filtered-profiles-table-container">
      <table className="filteredProfiles">
        <thead>
          <tr>
            <th></th>
            {Object.keys(filteredProfiles).map(profileId => (
              <th key={profileId}>Profile {profileId}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(categoryNames).map(category => (
            <tr key={category}>
              <td>{categoryNames[category]}</td>
              {Object.keys(filteredProfiles).map(profileId => (
                <td key={`${category}-${profileId}`}>
                  {filteredProfiles[profileId].flatMap(profile => profile[category] || []).join(", ")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
      );
    };
export default BuildSelector;