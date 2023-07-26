import React, { useState, useEffect, useRef } from 'react';
import {Button, Row, Col, Container, ListGroup, Table, FormLabel, FormSelect, InputGroup} from 'react-bootstrap';
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

const itemOptions = {
  perkDeck: [
    "Crew Chief", "Muscle", "Armorer", "Rogue", "Hitman", "Crook", "Burglar",
    "Infiltrator", "Sociopath", "Gambler", "Grinder", "Yakuza", "Ex-President",
    "Maniac", "Anarchist", "Biker", "Kingpin", "Sicario", "Stoic", "Hacker"
  ],
  antiSpecials: ['Shield', 'Bulldozer', 'Captain Winters', 'SWAT Turret'],
  support: ['Inspire', 'Transporter', 'Bulletstorm', 'OVE9000', 'Drill Sawgeant', 'Shaped charges'],
  deployable: ['First Aid Kit', 'Doctor Bag', 'Ammo Bag', 'Trip Mines and Shaped Charges', 'Sentry Gun', 'Suppressed Sentry Gun', 'ECM Jammers', 'Body Bag Case'],
  buildType: ['Tank', 'Health regen', 'Armor gating', 'Dodge', 'Stealth'],
  activeMechanics: ['Jokers (1)', 'Jokers (2)', 'Hostage Taker', 'High Value Target', 'Nine Lives', 'Swan Song'],
  primaryType: ['Assault Rifle', 'Shotgun', 'Akimbo Pistol', 'Akimbo Shotgun', 'Akimbo SMG', 'Sniper Rifle', 'Light Machine Gun', 'Bow', 'Grenade Launcher', 'OVE9000 Saw', 'Minigun', 'Flamethrower'],
  secondaryType: ['Pistol', 'Submachine Gun', 'Shotgun', 'Grenade Launcher', 'Rocket Launcher', 'Crossbow', 'Flamethrower', 'OVE9000 Saw'],
  melee: ['Buzzer', 'Shinsakuto Katana', 'Ice Pick', 'Other'],
  throwable: ['Concussion Grenade', 'Explosive throwable', 'Incendiary throwable', 'Impact throwable', 'Deck specific'],
  armor: ['Two-Piece Suit', 'Lightweight Ball. Vest', 'Ballistic/Heav./Comb. Vest', 'ICTV'],
  detectionRisk: ['3 - 15', '16 - 28', '29 - 75'],
};

const defaultProfile = {
  perkDeck: {},
  antiSpecials: {},
  support: {},
  deployable: {},
  buildType: {},
  activeMechanics: {},
  primaryType: {},
  secondaryType: {},
  melee: {},
  throwable: {},
  armor: {},
  detectionRisk: {},
};

const ProfileConstructor = () => {
    const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
    const [profiles, setProfiles] = useState(Array(15).fill(defaultProfile));
    const [isJsonLoaded, setIsJsonLoaded] = useState(false);
    const isLoadingJson = useRef(false);
  
const handleItemChange = (profileIndex, category, item) => {
      setProfiles((prevProfiles) => {
        const newProfiles = [...prevProfiles];
        newProfiles[profileIndex] = {
          ...newProfiles[profileIndex],
          [category]: {
            ...newProfiles[profileIndex][category],
            [item]: !newProfiles[profileIndex][category]?.[item],
          },
        };
        return newProfiles;
      });
    };
    
    const handleProfileSelectChange = (event) => {
      setSelectedProfileIndex(parseInt(event.target.value, 10));
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
    
      if (file) {
        // isLoadingJson.current = true;
        setIsJsonLoaded(true);
    
        const reader = new FileReader();
    
        reader.onload = (e) => {
          try {
            const loadedData = JSON.parse(e.target.result);
    
            const updatedProfiles = Array.from({ length: 15 }, (_, index) => {
              const profileNumber = (index + 1).toString();
              const profileData = loadedData[profileNumber] || [];
    
              const updatedProfile = {
                perkDeck: {},
                antiSpecials: {},
                support: {},
                deployable: {},
                buildType: {},
                activeMechanics: {},
                primaryType: {},
                secondaryType: {},
                melee: {},
                throwable: {},
                armor: {},
                detectionRisk: {},
              };
    
              profileData.forEach((categoryData) => {
                const category = Object.keys(categoryData)[0];
                const items = categoryData[category];
                if (Array.isArray(items)) {
                  items.forEach((item) => {
                    updatedProfile[category][item] = true;
                  });
                }
              });
    
              return updatedProfile;
            });
    
            setProfiles(updatedProfiles);
            setSelectedProfileIndex(0); // Select the first profile by default
            // isLoadingJson.current = false;
            setIsJsonLoaded(false);
          } catch (error) {
            console.error('Error parsing JSON file:', error);
            // isLoadingJson.current = false;
            setIsJsonLoaded(false);
          }
        };
    
        reader.readAsText(file);
      }
    };
    

 // Effect to auto-check checkboxes when profiles state is updated
 useEffect(() => {
    if (isJsonLoaded && profiles.length > 0) {
      // Get the selected items for the currently selected profile
      const selectedItems = profiles[selectedProfileIndex];
      // Update the checkboxes for each category
      Object.entries(categoryNames).forEach(([category, categoryName]) => {
        const selectedItemsForCategory = selectedItems[category] || {};
        itemOptions[category].forEach((item) => {
          const isChecked = selectedItemsForCategory[item] || false;
          handleItemChange(selectedProfileIndex, category, item, isChecked);
        });
      });

      setIsJsonLoaded(false); // Reset the isJsonLoaded state
    }
  }, [profiles, selectedProfileIndex, isJsonLoaded]);
  
      
      
      

  
    const exportToJson = () => {
        const jsonProfiles = {};
        profiles.forEach((profile, index) => {
          const jsonProfile = [];
          Object.entries(profile).forEach(([category, items]) => {
            const selectedItems = Object.keys(items).filter((item) => items[item]);
            if (selectedItems.length > 0) {
              jsonProfile.push({ [category]: selectedItems });
            }
          });
          jsonProfiles[index + 1] = jsonProfile;
        });
      
        const data = JSON.stringify(jsonProfiles, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'profiles.json';
        link.click();
      };

/**/
const [uploadedFileName, setUploadedFileName] = useState(null);
function UploadButton() {
  const inputFileRef = useRef(null);

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
        onClick={handleUpload}
        className={`btn btn-outline-${uploadedFileName ? 'success' : 'primary'}`}
      >
        {uploadedFileName ? uploadedFileName : 'Load profiles'}
      </button>
    </div>
  );
}

function goToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

    return (
      <div className="container">
      <div className="buttons">
      <UploadButton/>
      <Button onClick={exportToJson}>Export Profiles to JSON</Button>
      </div>
        {/* <input type="file" accept=".json" onChange={handleFileChange} /> */}
        <div className="profile-selector">
          {/* <label>Select Profile:</label> */}
          <div className="container">
          <FormSelect value={selectedProfileIndex} onChange={handleProfileSelectChange}>
            {profiles.map((profile, index) => (
              <option key={index} value={index}>
                Profile {index + 1}
              </option>
            ))}
          </FormSelect>
          </div>
        </div>
        <div>
          {/* <div className="container">
          <div className="profileNumber-title">Profile {selectedProfileIndex + 1}</div>
          </div> */}
          {Object.entries(categoryNames).map(([category, categoryName]) => (
            <div key={category} className="category-section">
              <div className="category-name">{categoryName}</div>
              {itemOptions[category].map((item) => (
                <label key={item} className="category-label">
                  <input
                    type="checkbox"
                    checked={profiles[selectedProfileIndex]?.[category]?.[item] || false}
                    onChange={() => handleItemChange(selectedProfileIndex, category, item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          ))}
        </div>
        
        
        <Button className="buttonGoToTop" onClick={() => goToTop()}>Go to top</Button>
      </div>
    );
  };
  
  export default ProfileConstructor;