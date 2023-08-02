import React, { useEffect, useState, useRef } from "react";
import {Button, Row, Col, Container, ListGroup, Table, Form} from 'react-bootstrap';
import { VscExpandAll, VscCollapseAll } from "react-icons/vsc"
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im"
import '../App.css';
import skillsData from '../database/skills.json'

const BuildSelectorNew = () => {
    
    const categoryNames = {
        perkDeck: "PERK DECK",
        equipment: "DEPLOYABLE",
        primaryWeapon: "PRIMARY WEAPON",
        secondaryWeapon: "SECONDARY WEAPON",
        melee: "MELEE",
        throwable: "THROWABLE",
        armor: "ARMOR",
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
        }));

    const allowedCategories = [
      "armor",
      "equipment",
      "melee",
      "perkDeck",
      "primaryWeapon",
      "secondaryWeapon",
      "throwable",
    ];

    const categoryOrder = [
        "perkDeck",
        "primaryWeapon",
        "secondaryWeapon",
        "armor",
        "throwable",
        "equipment",
        "melee",
      ];

    const categoryItems = {};

    // console.log(selectedSkills)

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

console.log(categoryItems, "antes")


  // Add a new object for "support" and include skills with the "support" property
  categoryItems["support"] = Array(15).fill(null);
  selectedSkills.forEach((profile, profileIndex) => {
    const supportSkill = Object.entries(profile).find(([_, value]) => {
      return value && skillsData[value] && skillsData[value].selector === "support";
    });

    if (supportSkill) {
      categoryItems["support"][profileIndex] = supportSkill[1];
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
  console.log(categoryItems, "despues")
  
    // ... Rest of the code ...

  
    // Display the category items in a table
    return (
      <div>
        {/* ... Other JSX ... */}
  
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
            {categoryItems.map(({ category, items }) => (
              <tr key={category}>
                <td>{category}</td>
                {items.map((item, profileIndex) => (
                  <td key={profileIndex}>{item}</td>
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