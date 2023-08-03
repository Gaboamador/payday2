import React, { useEffect, useState, useRef } from "react";
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"
import '../App.css';
import skillsData from '../database/skills.json'

const BuildSelectorNew = () => {
    
  // COMIENZO DE MAPPEO DE SKILLS
  // Convert skillsData object to an array of skills
 const skillsArray = Object.values(skillsData);
 // Organize skills by trees and subtrees
 const organizedSkills = {};
 for (const skill of skillsArray) {
   const { idWidth, idHeight, name, description, basic, ace, tier, subtree, tree, selector } = skill;
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
     selector,
   });
 }
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
// FIN DE MAPPEO DE SKILLS


  // RENOMBRA LAS CATEGORIAS CON LOS NOMBRES QUE VAN A APARECER EN LA TABLA
    const categoryNames = {
        perkDeck: "PERK DECK",
        equipment: "DEPLOYABLE",
        primaryWeapon: "PRIMARY WEAPON",
        secondaryWeapon: "SECONDARY WEAPON",
        melee: "MELEE",
        throwable: "THROWABLE",
        armor: "ARMOR",
        support: "SUPPORT",
        activeMechanics: "ACTIVE MECHANICS"
      };

   // Function to filter out category items
  const filterCategoryItems = () => {
    const savedSkills = localStorage.getItem('selectedSkills');
    const selectedSkills = savedSkills
      ? JSON.parse(savedSkills)
      : Array.from({ length: 15 }, () => ({
          skills: {}, // Object for selected skills (same as before)
          perkDeck: null,
          primaryWeapon: null,
          secondaryWeapon: null,
          armor: null,
          throwable: null,
          equipment: null,
          melee: null,
          support: null,
          activeMechanics: null,
        }));
    
        const allowedCategories = [
      "armor",
      "equipment",
      "melee",
      "perkDeck",
      "primaryWeapon",
      "secondaryWeapon",
      "throwable",
      "support",
      "activeMechanics",
    ];

    const categoryOrder = [
        "perkDeck",
        "support",
        "activeMechanics",
        "primaryWeapon",
        "secondaryWeapon",
        "armor",
        "throwable",
        "equipment",
        "melee",
      ];

    const categoryItems = {};

    selectedSkills.forEach((profile, profileIndex) => {
      Object.entries(profile).forEach(([key, value]) => {
        if (allowedCategories.includes(key)) {
          if (key === "primaryWeapon" || key === "secondaryWeapon") {
            // If the key is primaryWeapon or secondaryWeapon, display the subcategory property
            value = value ? (
                <div>
                  <div>{value.subcategory}</div>
                  <div>{value.weapon}</div>
                </div>
              ): null;
          }

          if (!categoryItems[key]) {
            categoryItems[key] = Array(15).fill(null);
          }
          categoryItems[key][profileIndex] = value;
        }
      });
    });


  // Add a new objects for "support" and "activeMechanics"
  categoryItems["support"] = Array(15).fill(null);
  categoryItems["activeMechanics"] = Array(15).fill(null);
  

// Include skills with the "support" property and value of "ace" or "Transporter" with value of "basic"
selectedSkills.forEach((profile, profileIndex) => {
  const supportSkills = Object.entries(profile).filter(([skillName, value]) => {
    if (value === "ace") {
      const skillInfo = organizedSkillsFlat.find((skill) => skill.name === skillName);
      return skillInfo && skillInfo.selector === "support";
    }

    if (value === "basic" && skillName === "Transporter") {
      return true;
    }

    return false;
  })
  .map(([skillName, value]) => `${skillName} (${value === "ace" ? "A" : "B"})`)
  .join(",\n");

  if (supportSkills.length > 0) {
    categoryItems["support"][profileIndex] = (
      <div>{supportSkills}</div>
    );
  }
});

// Include skills with the "active_mechanic" property and value of "ace" or "Joker" with value of "basic"
selectedSkills.forEach((profile, profileIndex) => {
  const activeMechanicsSkills = Object.entries(profile).filter(([skillName, value]) => {
    if (value === "ace") {
      const skillInfo = organizedSkillsFlat.find((skill) => skill.name === skillName);
      return skillInfo && skillInfo.selector === "active_mechanic";
    }

    if (value === "basic" && skillName === "Joker") {
      return true;
    }

    return false;
  })
  .map(([skillName, value]) => `${skillName} (${value === "ace" ? "A" : "B"})`)
  .join(",\n");

  if (activeMechanicsSkills.length > 0) {
    categoryItems["activeMechanics"][profileIndex] = (
      <div>{activeMechanicsSkills}</div>
    );
  }
});

  // Sort the category items based on the specified order
  const sortedCategoryItems = categoryOrder.map((category) => ({
    category: categoryNames[category], // Use the mapped category name
    items: categoryItems[category] || Array(15).fill(null),
  }));

  return sortedCategoryItems;
  
};
 

 const categoryItems = filterCategoryItems();
console.log(categoryItems, "category items")
//////////////////////////////////////////////////////////////////////////////////////
const [loadedData, setLoadedData] = useState(null);
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
  // Create a mapping of each category's items and their corresponding index
  const allItems = {};
  categoryItems.forEach((profile) => {
    profile.items.forEach((item, index) => {
      if (!allItems[profile.category]) allItems[profile.category] = {};
      allItems[profile.category][item] = index;
    });
  });

  // Create the category checkboxes dynamically
  return categoryItems.map((profile, profileIndex) => (
    // Category section
    <div key={`profile-${profileIndex}`} className="category-section">
      {/* Category name */}
      <div className="category-name" onClick={() => toggleCategoryVisibility(profile.category)}>
        {profile.category}
      </div>

      {/* Category items */}
      <div style={{ display: categoryVisibility[profile.category] ? 'block' : 'none' }} className="category-checkbox-container">
        {profile.items.map((item, itemIndex) => (
          <label key={`${profile.category}-${itemIndex}`} className="category-label">
            <input
              type="checkbox"
              checked={selectedItems[profile.category]?.[item] || false}
              onChange={() => handleCheckboxChange(profile.category, item)}
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

  const filteredProfilesData = categoryItems.map(({ category, items }) => {
    const shouldDisplay = selectedItemsArray.every(
      (item) => item.checked === false || (item.category === category && items.includes(item.item))
    );

    return {
      category,
      items: shouldDisplay ? items.slice() : Array(items.length).fill('-'),
    };
  });

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
  
  {/* <div className="container">
      <div className="buttons">
      

      <Button onClick={toggleAllCategoriesVisibility}>
        {toggleButtonText}
      </Button>
      
        <Button onClick={toggleFilterMode}>
          Filter Mode: {filterMode === 'and' ? 'AND' : 'OR'}
        </Button>
      </div>
      </div>
      {renderCategoryCheckboxes()} */}


  {/* PARTE DE CODIGO ORIGINAL DE ACA PARA ABAJO */}
        <div className="filtered-profiles-table-container">
      <table className="filteredProfiles">
        <thead>
          <tr>
            <th>Category</th>
            {Array.from({ length: 15 }, (_, index) => (
              <th key={index}>Profile {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* {categoryItems.map(({ category, items }) => ( */}
          {categoryItems.map(({ category, items }) => (
            <tr key={category}>
              <td>{category}</td>
              {items.map((item, profileIndex) => (
                <td key={`${category}-${profileIndex}`}>{item || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    </div>
    );
  };
  export default BuildSelectorNew;