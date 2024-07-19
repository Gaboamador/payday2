// SelectCategories.jsx
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { MdOutlineRadioButtonChecked, MdOutlineCheckBox } from "react-icons/md";

const SelectCategories = ({
  categories,
  selectedCategories,
  collapsed,
  toggleCollapse,
  handleToggleCategory,
  handleToggleSelectedCategories,
  isCheckboxMode,
  toggleMode,
  randomizedBuild
}) => {

  const isRolled = (categoryKey) => {
    const singularCategoryKey = categoryKey.endsWith('s') ? categoryKey.slice(0, -1) : categoryKey;
    return randomizedBuild[singularCategoryKey] !== "";
  };

  return (
    <div className="selectCategories">
      <Form style={{ marginTop: 0, marginBottom: 0 }} className="mainForm">
        <Form.Group>
          <Form.Label onClick={() => toggleCollapse("selectedCategories")} className={`form-title ${!collapsed.selectedCategories ? "selectedCategories" : ""}`}>
            SELECT CATEGORIES TO RANDOMIZE
            {!collapsed.selectedCategories ? (<GoChevronUp />) : (<GoChevronDown />)}
          </Form.Label>
          {!collapsed.selectedCategories && (
            <>
          <Button className="eyeSlashButton toggleMode" onClick={toggleMode}>
          Mode: switch to {isCheckboxMode ? <MdOutlineRadioButtonChecked/> : <MdOutlineCheckBox/>}
          </Button>
              <div className="categories-grid-container">
                {categories.map((category, index) => (
                   isCheckboxMode ? (
                  <div key={category.key} className="categories-grid-item">
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={category.label}
                      checked={selectedCategories.includes(category.key)}
                      onChange={() => handleToggleCategory(category.key)}
                    />
                  </div>
                   ):(
                    <Form.Check
                      key={index}
                      type="radio"
                      label={category.label}
                      name="category" // Ensure all radios belong to the same group
                      checked={selectedCategories.includes(category.key)}
                      onChange={() => handleToggleCategory(category.key)}
                      className={isRolled(category.key) ? 'rolled' : ''}
                    />
                   )
                ))}
                {isCheckboxMode &&
                <Button
                  className="checkUncheckAllButton"
                  variant="outline-secondary"
                  onClick={handleToggleSelectedCategories}
                >
                  {selectedCategories.length < 7 ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
                  {selectedCategories.length < 7 ? " Check All" : " Uncheck All"}
                </Button>
                }
              </div>
            </>
          )}
        </Form.Group>
      </Form>
    </div>
  );
};

export default SelectCategories;
