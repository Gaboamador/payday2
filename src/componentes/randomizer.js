import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"
import '../App.css';

const options = {
  primaryGuns: ["AMCAR Rifle","Commando 553 Rifle","Eagle Heavy Rifle","AK Rifle","CAR-4 Rifle","UAR Rifle","Cavity 9mm","AK.762 Rifle","JP36 Rifle","AK17 Rifle","Golden AK.762 Rifle","Bootleg Rifle","Queen's Wrath Rifle","M308 Rifle","Clarion Rifle","Lion's Roar Rifle","Valkyria Rifle","AK5 Rifle","Gecko 7.62 Rifle","AMR-16 Rifle","Little Friend 7.62 Assault Rifle","Falcon Rifle","Gewehr 3 Rifle","Predator 12G Shotgun","Breaker 12G Shotgun","Reinfeld 880 Shotgun","M1014 Shotgun","Raven Shotgun","IZHMA 12G Shotgun","Mosconi 12G Shotgun","Joceline O/U 12G Shotgun","Steakout 12G Shotgun","RPK Light Machine Gun","KSP 58 Light Machine Gun","KSP Light Machine Gun","Buzzsaw 42 Light Machine Gun","Brenner-21 Light Machine Gun","Rattlesnake Sniper Rifle","Platypus 70 Sniper Rifle","Lebensauger .308 Sniper Rifle","Desertfox Sniper Rifle","Contractor .308 Sniper Rifle","R93 Sniper Rifle","Repeater 1874 Sniper Rifle","Grom Sniper Rifle","Nagant Sniper Rifle","Thanatos .50 cal Sniper Rifle","Akimbo Chimano Compact Pistols","Akimbo Crosskill Pistols","Akimbo Bernetti 9 Pistols","Akimbo Deagle Pistols","Akimbo Chimano 88 Pistols","Akimbo Chimano Custom Pistols","Akimbo Signature .40 Pistols","Akimbo Gruber Kurz Pistols","Akimbo Interceptor 45 Pistols","Akimbo Contractor Pistols","Akimbo Bronco .44 Revolvers","Akimbo White Streak Pistols","Akimbo Baby Deagle Pistols","Akimbo Broomstick Pistols","Akimbo Castigo .44 Revolvers","Akimbo Crosskill Guard Pistols","Akimbo LEO Pistols","Akimbo STRYK 18c Pistols","Akimbo Matever .357 Revolvers","Akimbo Krinkov Submachine Guns","Akimbo Swedish K Submachine Guns","Akimbo Compact-5 Submachine Guns","Akimbo SpecOps Submachine Guns","Akimbo Heather Submachine Guns","Akimbo CR 805B Submachine Guns","Akimbo Mark 10 Submachine Guns","Akimbo Jacket's Piece","Akimbo Chicago Typewriter SMGs","Akimbo Cobra Submachine Guns","Akimbo Micro Uzi Submachine Guns","Akimbo CMP Submachine Guns","Akimbo Para Submachine Guns","Akimbo Jackal Submachine Guns","Akimbo Signature Submachine Guns","Akimbo Blaster 9mm Submachine Guns","Akimbo Kobus 90 Submachine Guns","Akimbo Kross Vertex Submachine Guns","Akimbo Tatonka Submachine Guns","Akimbo Patchett L2A1 Submachine Guns","Akimbo Uzi Submachine Guns","Akimbo Goliath 12G Shotguns","Brother Grimm 12G Shotguns","Akimbo Judge Shotguns","OVE9000 Saw","Plainsrider Bow","Light Crossbow","English Longbow","XL 5.56 Microgun","Vulcan Minigun","Heavy Crossbow","Piglet Grenade Launcher","Flamethrower Mk.1","GL40 Grenade Launcher"],
  secondaryGuns: ["Chimano 88 Pistol","Signature .40 Pistol","Gruber Kurz Pistol","Interceptor 45 Pistol","White Streak Pistol","Crosskill Pistol","Bernetti 9 Pistol","Bronco .44 revolver","Baby Deagle Pistol","Chimano Custom Pistol","Broomstick Pistol","Castigo .44 Revolver","5/7 AP Pistol","Contractor Pistol","Chimano Compact Pistol","Crosskill Guard Pistol","LEO Pistol","STRYK 18c Pistol","Pacemaker .45 Revolver","Matever .357 Revolver","Deagle Pistol","Swedish K Submachine Gun","SpecOps Submachine Gun","Mark 10 Submachine Gun","CR 805B Submachine Gun","Jacket's Piece","Compact-5 Submachine Gun","Chicago Typewriter Submachine Gun","Cobra Submachine Gun","CMP Submachine Gun","Para Submachine Gun","Micro Uzi Submachine Gun","Signature Submachine Gun","Jackal Submachine Gun","Heather Submachine Gun","Krinkov Submachine Gun","Blaster 9mm Submachine Gun","Kobus 90 Submachine Gun","Kross Vertex Submachine Gun","Tatonka Submachine Gun","Patchett L2A1 Submachine Gun","Uzi Submachine Gun","Pistol Crossbow","Compact 40mm Grenade Launcher","HRL-7 Rocket Launcher","China Puff 40mm Grenade Launcher","Commando 101 Rocket Launcher","MA-17 Flamethrower","Arbiter Grenade Launcher","OVE9000 Saw","Locomotive 12G Shotgun","GSPS 12G Shotgun","Goliath 12G Shotgun","Grimm 12G Shotgun","Street Sweeper Shotgun","The Judge Shotgun"],
  perkDecks: ["Crew Chief","Muscle","Armorer","Rogue","Hitman","Crook","Burglar","Infiltrator","Sociopath","Gambler","Grinder","Yakuza","Ex-President","Maniac","Anarchist","Biker","Kingpin","Sicario","Stoic","Hacker"],
  armors: ["Two-piece Suit","Ballistic Vest","Lightweight Ballistic Vest","Heavy Ballistic Vest","Flak Jacket","Combined Tactical Vest","ICTV"],
  throwables: ["Concussion Grenade","Matryoshka Grenade","Incendiary Grenade","Frag Grenade","HEF Grenade","Ace of Spades","Molotov Cocktail","Dynamite","Shuriken","Javelin","Throwing Knife","Throwing Axe"],
  equipments: ["Ammo Bag","Armor Bag","Body Bag Case","Doctor Bag","ECM Jammer","First Aid Kit","Sentry Gun","Suppressed Sentry Gun","Trip Mines and Shaped Charges"],
  melees: ["Weapon Butt","50 Blessings Briefcase","URSA Knife","Swagger Stick","Nova's Shank","Fists","350K Brass Knuckles","Ursa Tanto Knife","Pounder","Specialist Knives","The Motherforker","Spatula","K.L.A.S Shovel","Money Bundle","Empty Palm Kata","Bolt Cutters","Shawn's Shears","Utility Knife","Microphone","Selfie-stick","Bayonet Knife","Machete","Chain Whip","The Pen","Ice Pick","Electrical Brass Knuckles","Rezkoye","Telescopic Baton","Jackpot","Baseball Bat","Monkey Wrench","Classic Baton","Hockey Stick","Diving Knife","El Verdugo","Hackaton","Krieger Blade","Buckler Shield","Wing Butterfly Knife","You're Mine","Metal Detector","Croupier's Rake","Compact Hatchet","Lumber Lite L2","Potato Masher","Scalper Tomahawk","Switchblade","OVERKILL Boxing Gloves","Dragan's Cleaver Knife","Leather Sap","Shinsakuto Katana","Okinawan Style Sai","Pitchfork","Arkansas Toothpick","Microphone Stand","Psycho Knife","X-46 Knife","Talons","Bearded Axe","Hook","Cleaver Knife","Buzzer","Gold Fever","Carpenter's Delight","Clover's Shillelagh","Shepherd's Cane","Scout Knife","Trench Knife","Berger Combat Knife","Survival Tomahawk","Morning Star","Poker","Lucille Baseball Bat","Great Sword","The Spear of Freedom","Rivertown Glen Bottle","Ding Dong Breaching Tool","Tenderizer","Machete Knife","Utility Machete","Kunai Knife","Trautman Knife","Fire Axe"],
  heists: ["Art Gallery","Bank Heist: Cash","Bank Heist: Deposit","Bank Heist: Gold","Bank Heist: Random","Car Shop (STEALTH ONLY)","Cook Off","Diamond Store","Jewelry Store","Shadow Raid (STEALTH ONLY)","The Alesso Heist","Transport: Crossroads","Transport: Downtown","Transport: Harbor","Transport: Park","Transport: Train Heist","Transport: Underpass","Counterfeit","Diamond Heist","First World Bank","Green Bridge","Heat Street","Panic Room","Slaughterhouse","Undercover","Cursed Kill Room","Lab Rats","Prison Nightmare","Safe House Nightmare","Firestarter","Rats","Watchdogs","Boiling Point","Murky Station (STEALTH ONLY)","Alaskan Deal","Beneath the Mountain","Birth of Sky","Brooklyn Bank","Scarface Mansion","The Bomb: Dockyard","The Bomb: Forest","Brooklyn 10-10","The Yacht Heist (STEALTH ONLY)","Golden Grin Casino","Hotline Miami","Hoxton Breakout","Hoxton Revenge","The Big Bank","The Diamond","Big Oil","Election Day","Framing Frame","The Biker Heist","Aftershock","Four Stores","Goat Simulator","Mallcrasher","Meltdown","Nightclub","Santa's Workshop","Stealing Xmas","Ukrainian Job","White Xmas"],
};

const Payday2Randomizer = () => {

  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-gm7u55v7jisqivq4.us.auth0.com";
  
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
          },
        });
  
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const { user_metadata } = await metadataResponse.json();
  
        setUserMetadata(user_metadata);
      } catch (e) {
        // console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  const [selectedOptions, setSelectedOptions] = useState({
    primaryGuns: options.primaryGuns,
    secondaryGuns: options.secondaryGuns,
    perkDecks: options.perkDecks,
    armors: options.armors,
    throwables: options.throwables,
    equipments: options.equipments,
    melees: options.melees,
    heists: options.heists,
  });

  /*const [randomizedBuild, setRandomizedBuild] = useState({});*/
  const [randomizedBuild, setRandomizedBuild] = useState({
    armor: localStorage.getItem("randomizedBuild_armor") || "",
    equipment: localStorage.getItem("randomizedBuild_equipment") || "",
    melee: localStorage.getItem("randomizedBuild_melee") || "",
    perkDeck: localStorage.getItem("randomizedBuild_perkDeck") || "",
    primaryGun: localStorage.getItem("randomizedBuild_primaryGun") || "",
    secondaryGun: localStorage.getItem("randomizedBuild_secondaryGun") || "",
    throwable: localStorage.getItem("randomizedBuild_throwable") || ""
  });
  const armor = randomizedBuild.armor;
  const equipment = randomizedBuild.equipment;
  const melee = randomizedBuild.melee;
  const perkDeck = randomizedBuild.perkDeck;
  const primaryGun = randomizedBuild.primaryGun;
  const secondaryGun = randomizedBuild.secondaryGun;
  const throwable = randomizedBuild.throwable;

  useEffect(() => {
    localStorage.setItem("randomizedBuild_armor", randomizedBuild.armor);
    localStorage.setItem("randomizedBuild_equipment", randomizedBuild.equipment);
    localStorage.setItem("randomizedBuild_melee", randomizedBuild.melee);
    localStorage.setItem("randomizedBuild_perkDeck", randomizedBuild.perkDeck);
    localStorage.setItem("randomizedBuild_primaryGun", randomizedBuild.primaryGun);
    localStorage.setItem("randomizedBuild_secondaryGun", randomizedBuild.secondaryGun);
    localStorage.setItem("randomizedBuild_throwable", randomizedBuild.throwable);
  }, [randomizedBuild]);


  /**/
  /*const [randomizedHeist, setRandomizedHeist] = useState({});*/
  const [randomizedHeist, setRandomizedHeist] = useState({
    heist: localStorage.getItem("randomizedHeist_heist") || "",
  })
  const heist = randomizedHeist.heist;
  useEffect(() => {
    localStorage.setItem("randomizedHeist_heist", randomizedHeist.heist);
  }, [randomizedHeist]);


  const [showTable, setShowTable] = useState(false);

  const [showTableHeist, setShowTableHeist] = useState(false);

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

  const handleOptionChange = (category, item, isChecked) => {
    setSelectedOptions((prevState) => {
      const selectedItems = prevState[category];
      let updatedItems;
      if (isChecked) {
        updatedItems = [...selectedItems, item];
      } else {
        updatedItems = selectedItems.filter((selectedItem) => selectedItem !== item);
      }
      return {
        ...prevState,
        [category]: updatedItems,
      };
    });
  };

  const handleRandomize = () => {
    const randomizedBuild = {
      primaryGun: selectedCategories.includes('primaryGuns') ? getRandomItem(selectedOptions.primaryGuns) : localStorage.getItem("randomizedBuild_primaryGun") || "",
      secondaryGun: selectedCategories.includes('secondaryGuns') ? getRandomItem(selectedOptions.secondaryGuns) : localStorage.getItem("randomizedBuild_secondaryGun") || "",
      perkDeck: selectedCategories.includes('perkDecks') ? getRandomItem(selectedOptions.perkDecks) : localStorage.getItem("randomizedBuild_perkDeck") || "",
      armor: selectedCategories.includes('armors') ? getRandomItem(selectedOptions.armors) : localStorage.getItem("randomizedBuild_armor") || "",
      throwable: selectedCategories.includes('throwables') ? getRandomItem(selectedOptions.throwables) : localStorage.getItem("randomizedBuild_throwable") || "",
      equipment: selectedCategories.includes('equipments') ? getRandomItem(selectedOptions.equipments) : localStorage.getItem("randomizedBuild_equipment") || "",
      melee: selectedCategories.includes('melees') ? getRandomItem(selectedOptions.melees) : localStorage.getItem("randomizedBuild_melee") || "",
    };

    setRandomizedBuild(randomizedBuild);
    setShowTable(true);
  };

  // const handleRandomizeHeist = () => {
  //   const randomizedHeist = {
  //     heist: getRandomItem(selectedOptions.heists),
  //   };

  //   setRandomizedHeist(randomizedHeist);
  //   setShowTableHeist(true);
  // };

  const [heistWeights, setHeistWeights] = useState({});

  const handleRandomizeHeist = () => {
    const remainingHeists = options.heists.filter(heist => !heistWeights[heist]);
    if (remainingHeists.length === 0) {
      // All heists have been picked, reset the weights
      setHeistWeights({});
    } else {
      const randomHeist = getRandomWeightedItem(remainingHeists, heistWeights);
      const updatedWeights = {
        ...heistWeights,
        [randomHeist]: (heistWeights[randomHeist] || 1) * 0.5, // Decrease the weight by half
      };
      setHeistWeights(updatedWeights);
      setRandomizedHeist({ heist: randomHeist });
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

  const getRandomItem = (items) => {
    if (items.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };

  const [collapsed, setCollapsed] = useState({
    primaryGuns: false,
    secondaryGuns: false,
    perkDecks: false,
    armors: false,
    throwables: false,
    equipments: false,
    melees: false,
    heists: false,
    all: false,
    selectedCategories: true,
  });


  const toggleCollapse = (category) => {
    setCollapsed((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleAllCollapse = () => {
    setCollapsed((prev) => ({
      ...prev,
      all: !prev.all,
      primaryGuns: !prev.all,
      secondaryGuns: !prev.all,
      perkDecks: !prev.all,
      armors: !prev.all,
      throwables: !prev.all,
      equipments: !prev.all,
      melees: !prev.all,
      heists: !prev.all
    }));
  };

  const handleToggleCheckAll = (category) => {
    setSelectedOptions((prevState) => {
      const allChecked = prevState[category].length === options[category].length;
      const updatedSelection = allChecked ? [] : options[category];
      return {
        ...prevState,
        [category]: updatedSelection,
      };
    });
  };

  const handleToggleSelectedCategories = () => {
    setSelectedCategories((prevState) => {
      return prevState.length === Object.keys(selectedOptions).length ? [] : Object.keys(selectedOptions);
    });
  };
  
  const handleToggleCheckAllCategories = () => {
    setSelectedOptions((prevState) => {
      const allCategoriesChecked = Object.keys(prevState).every(
        (category) => prevState[category].length === options[category].length
      );
  
      const updatedSelection = allCategoriesChecked
        ? Object.keys(prevState).reduce((acc, category) => {
            acc[category] = [];
            return acc;
          }, {})
        : Object.keys(prevState).reduce((acc, category) => {
            acc[category] = options[category];
            return acc;
          }, {});
  
      return updatedSelection;
    });
  };
  
  
  function goToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }


  const categories = [
    { key: "primaryGuns", label: "Primary Guns" },
    { key: "secondaryGuns", label: "Secondary Guns" },
    { key: "perkDecks", label: "Perk Decks" },
    { key: "armors", label: "Armors" },
    { key: "throwables", label: "Throwables" },
    { key: "equipments", label: "Equipments" },
    { key: "melees", label: "Melees" },
  ];  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const handleToggleCategory = (category) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(category)) {
        return prevSelectedCategories.filter((c) => c !== category);
      } else {
        return [...prevSelectedCategories, category];
      }
    });
  };

  
return (
<div>
{/* <Button onClick={handleReset}>Reset Loaded Profiles</Button> */}
{/* {isAuthenticated ? (
    <> */}
    <div className="container">
<Form>
  <Form.Group>
    <Form.Label onClick={() => toggleCollapse("selectedCategories")}>SELECT CATEGORIES TO RANDOMIZE</Form.Label>
    {!collapsed.selectedCategories && (
      <>
        <Button
          className="checkUncheckAllButton"
          variant="outline-secondary"
          onClick={handleToggleSelectedCategories}
        >
          {selectedCategories.length === categories.length ? <ImCheckboxUnchecked /> : <ImCheckboxChecked />}
          {selectedCategories.length === categories.length ? " Uncheck All" : " Check All"}
        </Button>
        {categories.map((category) => (
          <div key={category.key}>
            <Form.Check
              type="checkbox"
              label={category.label}
              checked={selectedCategories.includes(category.key)}
              onChange={() => handleToggleCategory(category.key)}
            />
          </div>
        ))}
      </>
    )}
  </Form.Group>
</Form>
</div>

  <div className="randomBuildContainer backgroundImage" style={{marginTop: 0}}>
        <div className="buttons">
          <Button className="randomizeButton" onClick={handleRandomize}>RANDOMIZE BUILD</Button>
          <Button className="eyeSlashButton" onClick={() => setShowTable((prevState) => !prevState)}>{showTable ? <FiEyeOff/> : <FiEye/>}</Button>
          <Button className="eyeSlashButton" onClick={() => handleResetBuild()}>Reset Build</Button>
        </div>

    {showTable && (
    <Table className="randomBuildTable">
      <tbody>
          <tr>
              <td>Primary Gun</td>
              <td>{randomizedBuild.primaryGun}</td>
          </tr>
          <tr>
              <td>Secondary Gun</td>
              <td>{randomizedBuild.secondaryGun}</td>
          </tr>
          <tr>
              <td>Perk Deck</td>
              <td>{randomizedBuild.perkDeck}</td>
          </tr>
          <tr>
              <td>Armor</td>
              <td>{randomizedBuild.armor}</td>
          </tr>
          <tr>
              <td>Throwable</td>
              <td>{randomizedBuild.throwable}</td>
          </tr>
          <tr>
              <td>Equipment</td>
              <td>{randomizedBuild.equipment}</td>
          </tr>
          <tr>
              <td>Melee</td>
              <td>{randomizedBuild.melee}</td>
          </tr>
      </tbody>
    </Table>
    )}
  </div>

  <div className="randomBuildContainer backgroundImage">
        <div className="buttons">
          <Button className="randomizeButton" onClick={handleRandomizeHeist}>RANDOMIZE HEIST</Button>
          <Button className="eyeSlashButton" onClick={() => setShowTableHeist((prevState) => !prevState)}>{showTableHeist ? <FiEyeOff/> : <FiEye/>}</Button>
          <Button className="eyeSlashButton" onClick={() => handleResetHeist()}>Reset Heist</Button>
        </div>

    {showTableHeist && (
    <Table className="randomBuildTable">
      <tbody>
          <tr>
              <td>Heist</td>
              <td>{randomizedHeist.heist}</td>
          </tr>
      </tbody>
    </Table>
    )}
  </div>

  <div className="container">
        <div className="buttons">
        <Button className="expandAllCategoriesButton" onClick={toggleAllCollapse}>{collapsed.all ? (<VscExpandAll/>) : (<VscCollapseAll/>)}{collapsed.all ? " Expand All" : " Collapse All"}</Button>
        <Button className="checkUncheckAllCategoriesButton" onClick={() => handleToggleCheckAllCategories()}>
          {selectedOptions.primaryGuns.length === options.primaryGuns.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
          {selectedOptions.primaryGuns.length === options.primaryGuns.length ? " Uncheck All Categories" : " Check All Categories"}
        </Button>
        </div>
      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("primaryGuns")}>PRIMARY GUNS</Form.Label>
        {!collapsed.primaryGuns && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("primaryGuns")}>
              {selectedOptions.primaryGuns.length === options.primaryGuns.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.primaryGuns.length === options.primaryGuns.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.primaryGuns.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.primaryGuns.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("primaryGuns", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>

      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("secondaryGuns")}>SECONDARY GUNS</Form.Label>
        {!collapsed.secondaryGuns && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("secondaryGuns")}>
              {selectedOptions.secondaryGuns.length === options.secondaryGuns.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.secondaryGuns.length === options.secondaryGuns.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.secondaryGuns.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.secondaryGuns.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("secondaryGuns", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>

      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("perkDecks")}>PERK DECKS</Form.Label>
        {!collapsed.perkDecks && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("perkDecks")}>
              {selectedOptions.perkDecks.length === options.perkDecks.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.perkDecks.length === options.perkDecks.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.perkDecks.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.perkDecks.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("perkDecks", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>
              
      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("armors")}>ARMORS</Form.Label>
        {!collapsed.armors && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("armors")}>
              {selectedOptions.armors.length === options.armors.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.armors.length === options.armors.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.armors.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.armors.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("armors", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>

      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("throwables")}>THROWABLES</Form.Label>
        {!collapsed.throwables && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("throwables")}>
              {selectedOptions.throwables.length === options.throwables.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.throwables.length === options.throwables.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.throwables.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.throwables.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("throwables", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>

      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("equipments")}>EQUIPMENTS</Form.Label>
        {!collapsed.equipments && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("equipments")}>
              {selectedOptions.equipments.length === options.equipments.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.equipments.length === options.equipments.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.equipments.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.equipments.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("equipments", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>

      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("melees")}>MELEES</Form.Label>
        {!collapsed.melees && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("melees")}>
              {selectedOptions.melees.length === options.melees.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.melees.length === options.melees.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.melees.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.melees.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("melees", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>

      <Form>
        <Form.Group>
        <Form.Label onClick={() => toggleCollapse("heists")}>HEISTS</Form.Label>
        {!collapsed.heists && (
          <>
            <Button className="checkUncheckAllButton" variant="outline-secondary" onClick={() => handleToggleCheckAll("heists")}>
              {selectedOptions.heists.length === options.heists.length ? (<ImCheckboxUnchecked/>) : (<ImCheckboxChecked/>)}
              {selectedOptions.heists.length === options.heists.length ? " Uncheck All" : " Check All"}
            </Button>
            {options.heists.map((option) => (
              <div key={option}>
                <Form.Check
                  type="checkbox"
                  label={option}
                  id={option}
                  value={option}
                  checked={selectedOptions.heists.includes(option)}
                  onChange={(e) =>
                    handleOptionChange("heists", option, e.target.checked)
                  }
                />
              </div>
            ))}
          </>
        )}
      </Form.Group>
      </Form>
      
  </div>
  <Button className="buttonGoToTop" onClick={() => goToTop()}>Go to top</Button>
  {/* </> ) : (
    <Container>
    <LoginButton/>
    </Container>
  )} */}
</div>
);
};

export default Payday2Randomizer;