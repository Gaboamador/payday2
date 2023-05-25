import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login";
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"
import '../App.css';

const options = {
  primaryGuns: ["AMCAR Rifle (A1)","Commando 553 Rifle (B1)","Eagle Heavy Rifle (C1)","AK Rifle (D1)","CAR-4 Rifle (A2)","UAR Rifle (B2)","Cavity 9mm (C2)","AK.762 Rifle (D2)","JP36 Rifle (A3)","AK17 Rifle (B3)","Golden AK.762 Rifle (C3)","Bootleg Rifle (D3)","Queen's Wrath Rifle (A4)","M308 Rifle (B4)","Clarion Rifle (C4)","Lion's Roar Rifle (D4)","Valkyria Rifle (A5)","AK5 Rifle (B5)","Gecko 7.62 Rifle (C5)","AMR-16 Rifle (D5)","Little Friend 7.62 Assault Rifle (A6)","Falcon Rifle (B6)","Gewehr 3 Rifle (C6)","Predator 12G Shotgun (A1)","Breaker 12G Shotgun (B1)","Reinfeld 880 Shotgun (C1)","M1014 Shotgun (D1)","Raven Shotgun (A2)","IZHMA 12G Shotgun (B2)","Mosconi 12G Shotgun (C2)","Joceline O/U 12G Shotgun (D2)","Steakout 12G Shotgun (A3)","RPK Light Machine Gun (A1)","KSP 58 Light Machine Gun (B1)","KSP Light Machine Gun (C1)","Buzzsaw 42 Light Machine Gun (D1)","Brenner-21 Light Machine Gun (A2)","Rattlesnake Sniper Rifle (A1)","Platypus 70 Sniper Rifle (B1)","Lebensauger .308 Sniper Rifle (C1)","Desertfox Sniper Rifle (D1)","Contractor .308 Sniper Rifle (A2)","R93 Sniper Rifle (B2)","Repeater 1874 Sniper Rifle (C2)","Grom Sniper Rifle (D2)","Nagant Sniper Rifle (A3)","Thanatos .50 cal Sniper Rifle (B3)","Akimbo Chimano Compact Pistols (A1)","Akimbo Crosskill Pistols (B1)","Akimbo Bernetti 9 Pistols (C1)","Akimbo Deagle Pistols (D1)","Akimbo Chimano 88 Pistols (A2)","Akimbo Chimano Custom Pistols (B2)","Akimbo Signature .40 Pistols (C2)","Akimbo Gruber Kurz Pistols (D2)","Akimbo Interceptor 45 Pistols (A3)","Akimbo Contractor Pistols (B3)","Akimbo Bronco .44 Revolvers (C3)","Akimbo White Streak Pistols (D3)","Akimbo Baby Deagle Pistols (A4)","Akimbo Broomstick Pistols (B4)","Akimbo Castigo .44 Revolvers (C4)","Akimbo Crosskill Guard Pistols (D4)","Akimbo LEO Pistols (A5)","Akimbo STRYK 18c Pistols (B5)","Akimbo Matever .357 Revolvers (C5)","Akimbo Krinkov Submachine Guns (A1)","Akimbo Swedish K Submachine Guns (B1)","Akimbo Compact-5 Submachine Guns (C1)","Akimbo SpecOps Submachine Guns (D1)","Akimbo Heather Submachine Guns (A2)","Akimbo CR 805B Submachine Guns (B2)","Akimbo Mark 10 Submachine Guns (C2)","Akimbo Jacket's Piece (D2)","Akimbo Chicago Typewriter SMGs (A3)","Akimbo Cobra Submachine Guns (B3)","Akimbo Micro Uzi Submachine Guns (C3)","Akimbo CMP Submachine Guns (D3)","Akimbo Para Submachine Guns (A4)","Akimbo Jackal Submachine Guns (B4)","Akimbo Signature Submachine Guns (C4)","Akimbo Blaster 9mm Submachine Guns (D4)","Akimbo Kobus 90 Submachine Guns (A5)","Akimbo Kross Vertex Submachine Guns (B5)","Akimbo Tatonka Submachine Guns (C5)","Akimbo Patchett L2A1 Submachine Guns (D5)","Akimbo Uzi Submachine Guns (A6)","Akimbo Goliath 12G Shotguns (A1)","Brother Grimm 12G Shotguns (B1)","Akimbo Judge Shotguns (C1)","OVE9000 Saw (A1)","Plainsrider Bow (B1)","Light Crossbow (C1)","English Longbow (D1)","XL 5.56 Microgun (A2)","Vulcan Minigun (B2)","Heavy Crossbow (C2)","Piglet Grenade Launcher (D2)","Flamethrower Mk.1 (A3)","GL40 Grenade Launcher (B3)"],
  secondaryGuns: ["Chimano 88 Pistol (A1)","Signature .40 Pistol (B1)","Gruber Kurz Pistol (C1)","Interceptor 45 Pistol (D1)","White Streak Pistol (A2)","Crosskill Pistol (B2)","Bernetti 9 Pistol (C2)","Bronco .44 revolver (D2)","Baby Deagle Pistol (A3)","Chimano Custom Pistol (B3)","Broomstick Pistol (C3)","Castigo .44 Revolver (D3)","5/7 AP Pistol (A4)","Contractor Pistol (B4)","Chimano Compact Pistol (C4)","Crosskill Guard Pistol (D4)","LEO Pistol (A5)","STRYK 18c Pistol (B5)","Pacemaker .45 Revolver (C5)","Matever .357 Revolver (D5)","Deagle Pistol (A6)","Swedish K Submachine Gun (A1)","SpecOps Submachine Gun (B1)","Mark 10 Submachine Gun (C1)","CR 805B Submachine Gun (D1)","Jacket's Piece (A2)","Compact-5 Submachine Gun (B2)","Chicago Typewriter Submachine Gun (C2)","Cobra Submachine Gun (D2)","CMP Submachine Gun (A3)","Para Submachine Gun (B3)","Micro Uzi Submachine Gun (C3)","Signature Submachine Gun (D3)","Jackal Submachine Gun (A4)","Heather Submachine Gun (B4)","Krinkov Submachine Gun (C4)","Blaster 9mm Submachine Gun (D4)","Kobus 90 Submachine Gun (A5)","Kross Vertex Submachine Gun (B5)","Tatonka Submachine Gun (C5)","Patchett L2A1 Submachine Gun (D5)","Uzi Submachine Gun (A6)","Pistol Crossbow (A1)","Compact 40mm Grenade Launcher (B1)","HRL-7 Rocket Launcher (C1)","China Puff 40mm Grenade Launcher (D1)","Commando 101 Rocket Launcher (A2)","MA-17 Flamethrower (B2)","Arbiter Grenade Launcher (C2)","OVE9000 Saw (D2)","Locomotive 12G Shotgun (A1)","GSPS 12G Shotgun (B1)","Goliath 12G Shotgun (C1)","Grimm 12G Shotgun (D1)","Street Sweeper Shotgun (A2)","The Judge Shotgun (B2)"],
  perkDecks: ["Crew Chief (1)","Muscle (2)","Armorer (3)","Rogue (4)","Hitman (5)","Crook (6)","Burglar (7)","Infiltrator (8)","Sociopath (9)","Gambler (10)","Grinder (11)","Yakuza (12)","Ex-President (13)","Maniac (14)","Anarchist (15)","Biker (16)","Kingpin (17)","Sicario (18)","Stoic (19)","Hacker (20)"],
  armors: ["Two-piece Suit (A1)","Ballistic Vest (B1)","Lightweight Ballistic Vest (C1)","Heavy Ballistic Vest (A2)","Flak Jacket (B2)","Combined Tactical Vest (C2)","Improved Combined Tactical Vest (A3)"],
  throwables: ["Concussion Grenade (A1)","Matryoshka Grenade (B1)","Incendiary Grenade (C1)","Frag Grenade (D1)","HEF Grenade (A2)","Ace of Spades (B2)","Molotov Cocktail (C2)","Dynamite (D2)","Shuriken (A3)","Javelin (B3)","Throwing Knife (C3)","Throwing Axe (D3)"],
  equipments: ["Ammo Bag (A1)","Armor Bag (B1)","Body Bag Case (C1)","Doctor Bag (A2)","ECM Jammer (B2)","First Aid Kit (C2)","Sentry Gun (A3)","Suppressed Sentry Gun (B3)","Trip Mines and Shaped Charges (C3)"],
  melees: ["Weapon Butt (1-A1)","50 Blessings Briefcase (1-B1)","URSA Knife (1-C1)","Swagger Stick (1-D1)","Nova's Shank (1-A2)","Fists (1-B2)","350K Brass Knuckles (1-C2)","Ursa Tanto Knife (1-D2)","Pounder (1-A3)","Specialist Knives (1-B3)","The Motherforker (1-C3)","Spatula (1-D3)","K.L.A.S Shovel (1-A4)","Money Bundle (1-B4)","Empty Palm Kata (1-C4)","Bolt Cutters (1-D4)","Shawn's Shears (2-A1)","Utility Knife (2-B1)","Microphone (2-C1)","Selfie-stick (2-D1)","Bayonet Knife (2-A2)","Machete (2-B2)","Chain Whip (2-C2)","The Pen (2-D2)","Ice Pick (2-A3)","Electrical Brass Knuckles (2-B3)","Rezkoye (2-C3)","Telescopic Baton (2-D3)","Jackpot (2-A4)","Baseball Bat (2-B4)","Monkey Wrench (2-C4)","Classic Baton (2-D4)","Hockey Stick (3-A1)","Diving Knife (3-B1)","El Verdugo (3-C1)","Hackaton (3-D1)","Krieger Blade (3-A2)","Buckler Shield (3-B2)","Wing Butterfly Knife (3-C2)","You're Mine (3-D2)","Metal Detector (3-A3)","Croupier's Rake (3-B3)","Compact Hatchet (3-C3)","Lumber Lite L2 (3-D3)","Hotline 8000x (3-A4)","Potato Masher (3-B4)","Scalper Tomahawk (3-C4)","Switchblade (3-D4)","OVERKILL Boxing Gloves (4-A1)","Dragan's Cleaver Knife (4-B1)","Leather Sap (4-C1)","Shinsakuto Katana (4-D1)","Okinawan Style Sai (4-A2)","Pitchfork (4-B2)","Arkansas Toothpick (4-C2)","Microphone Stand (4-D2)","Psycho Knife (4-A3)","X-46 Knife (4-B3)","Talons (4-C3)","Bearded Axe (4-D3)","Hook (4-A4)","Cleaver Knife (4-B4)","Buzzer (4-C4)","Gold Fever (4-D4)","Carpenter's Delight (5-A1)","Clover's Shillelagh (5-B1)","Shepherd's Cane (5-C1)","Scout Knife (5-D1)","Trench Knife (5-A2)","Berger Combat Knife (5-B2)","Survival Tomahawk (5-C2)","Morning Star (5-D2)","Poker (5-A3)","Lucille Baseball Bat (5-B3)","Great Sword (5-C3)","The Spear of Freedom (5-D3)","Rivertown Glen Bottle (5-A4)","Ding Dong Breaching Tool (5-B4)","Tenderizer (5-C4)","Machete Knife (5-D4)","Utility Machete (6-A1)","Kunai Knife (6-B1)","Trautman Knife (6-C1)","Fire Axe (6-D1)"],
  heists: ["Art Gallery (Bain-1)","Bank Heist: Cash (Bain-2)","Bank Heist: Deposit (Bain-3)","Bank Heist: Gold (Bain-4)","Bank Heist: Random (Bain-5)","Car Shop (STEALTH ONLY) (Bain-6)","Cook Off (Bain-7)","Diamond Store (Bain-8)","Jewelry Store (Bain-9)","Shadow Raid (STEALTH ONLY) (Bain-10)","The Alesso Heist (Bain-11)","Transport: Crossroads (Bain-12)","Transport: Downtown (Bain-13)","Transport: Harbor (Bain-14)","Transport: Park (Bain-15)","Transport: Train Heist (Bain-16)","Transport: Underpass (Bain-17)","Counterfeit (Classics-1)","Diamond Heist (Classics-2)","First World Bank (Classics-3)","Green Bridge (Classics-4)","Heat Street (Classics-5)","Panic Room (Classics-6)","Slaughterhouse (Classics-7)","Undercover (Classics-8)","Cursed Kill Room (Events-1)","Lab Rats (Events-2)","Prison Nightmare (Events-3)","Safe House Nightmare (Events-4)","Firestarter (Hector-1)","Rats (Hector-2)","Watchdogs (Hector-3)","Boiling Point (Jimmy-1)","Murky Station (STEALTH ONLY) (Jimmy-2)","Alaskan Deal (Locke-1)","Beneath the Mountain (Locke-2)","Birth of Sky (Locke-3)","Brooklyn Bank (Locke-4)","Scarface Mansion (The Butcher-1)","The Bomb: Dockyard (The Butcher-2)","The Bomb: Forest (The Butcher-3)","Brooklyn 10-10 (The Continental-1)","The Yacht Heist (STEALTH ONLY) (The Continental-2)","Golden Grin Casino (The Dentist-1)","Hotline Miami (The Dentist-2)","Hoxton Breakout (The Dentist-3)","Hoxton Revenge (The Dentist-4)","The Big Bank (The Dentist-5)","The Diamond (The Dentist-6)","Big Oil (The Elephant-1)","Election Day (The Elephant-2)","Framing Frame (The Elephant-3)","The Biker Heist (The Elephant-4)","Aftershock (Vlad-1)","Four Stores (Vlad-2)","Goat Simulator (Vlad-3)","Mallcrasher (Vlad-4)","Meltdown (Vlad-5)","Nightclub (Vlad-6)","Santa's Workshop (Vlad-7)","Stealing Xmas (Vlad-8)","Ukrainian Job (Vlad-9)","White Xmas (Vlad-10)"],
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
        console.log(e.message);
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

  const handleRandomizeHeist = () => {
    const randomizedHeist = {
      heist: getRandomItem(selectedOptions.heists),
    };

    setRandomizedHeist(randomizedHeist);
    setShowTableHeist(true);
  };

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

  const selectedCategoriesNoHeists = selectedCategories.filter(category => category !== "heists");

return (
<div>
{isAuthenticated ? (
    <>
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
          {selectedCategoriesNoHeists.length === categories.length ? <ImCheckboxUnchecked /> : <ImCheckboxChecked />}
          {selectedCategoriesNoHeists.length === categories.length ? " Uncheck All" : " Check All"}
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
  </> ) : (
    <Container>
    <LoginButton/>
    </Container>
  )}
</div>
);
};

export default Payday2Randomizer;