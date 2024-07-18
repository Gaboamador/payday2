// SelectCategories.jsx
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

const SelectCategories = ({
  categories,
  selectedCategories,
  collapsed,
  toggleCollapse,
  handleToggleCategory,
  handleToggleSelectedCategories
}) => {
  return (
    <div className="selectCategories">
      <Form style={{ marginTop: 0, marginBottom: 0 }} className="mainForm">
        <Form.Group>
          <Form.Label onClick={() => toggleCollapse("selectedCategories")} className="form-title">
            SELECT CATEGORIES TO RANDOMIZE
            {!collapsed.selectedCategories ? (<GoChevronUp />) : (<GoChevronDown />)}
          </Form.Label>
          {!collapsed.selectedCategories && (
            <>
              <div className="categories-grid-container">
                {categories.map((category) => (
                  <div key={category.key} className="categories-grid-item">
                    <Form.Check
                      type="checkbox"
                      label={category.label}
                      checked={selectedCategories.includes(category.key)}
                      onChange={() => handleToggleCategory(category.key)}
                    />
                  </div>
                ))}
                <Button
                  className="checkUncheckAllButton"
                  variant="outline-secondary"
                  onClick={handleToggleSelectedCategories}
                >
                  {selectedCategories.length < 7 ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
                  {selectedCategories.length < 7 ? " Check All" : " Uncheck All"}
                </Button>
              </div>
            </>
          )}
        </Form.Group>
      </Form>
    </div>
  );
};

export default SelectCategories;
