import _ from 'lodash';
import React, { useState, useEffect } from 'react';
// import { MultiSelect } from 'react-multi-select-component';
import Select from 'react-select';

// const ItemRenderer = ({ checked, option, onClick, disabled }) => (
//   <div className={`item-renderer ${disabled && 'disabled'}`}>
//     <input type="checkbox" onClick={onClick} checked={checked} tabIndex={-1} disabled={disabled} />
//     <span>{option.label}</span>
//   </div>
// );

export const Multiselect = function Multiselect({
  id,
  component,
  validate,
  height,
  properties,
  styles,
  exposedVariables,
  setExposedVariable,
  setExposedVariables,
  onComponentClick,
  darkMode,
  fireEvent,
  dataCy,
}) {
  const { label, value, values, display_values } = properties;
  const { borderRadius, visibility, disabledState, boxShadow, justifyContent } = styles;
  const [selected, setSelected] = useState([]);
  const [searched, setSearched] = useState('');
  const validationData = validate(value);
  const { isValid, validationError } = validationData;

  const selectAllOption = {
    value: '<SELECT_ALL>',
    label: 'Select All',
  };

  let selectOptions = [];
  try {
    selectOptions = [
      selectAllOption,
      ...values.map((value, index) => {
        return { label: display_values[index], value: value };
      }),
    ];
  } catch (err) {
    console.log(err);
  }

  useEffect(() => {
    let newValues = [];

    if (_.intersection(values, value)?.length === value?.length) newValues = value;

    setExposedVariable('values', newValues);
    setSelected(selectOptions.filter((option) => newValues.includes(option.value)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values), JSON.stringify(display_values)]);

  useEffect(() => {
    setExposedVariable('values', value);
    setSelected(selectOptions.filter((option) => value.includes(option.value)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value), JSON.stringify(display_values)]);

  useEffect(() => {
    if (value && !selected) {
      setSelected(selectOptions.filter((option) => properties.value.includes(option.value)));
    }

    if (JSON.stringify(exposedVariables.values) === '{}') {
      setSelected(selectOptions.filter((option) => properties.value.includes(option.value)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = (items) => {
    // Check if "Select All" was selected
    const isSelectAllSelected = items.some((item) => item.value === selectAllOption.value);

    if (isSelectAllSelected) {
      if (selected.length === selectOptions.length - 1) {
        // Deselect all options
        setSelected([]);
        setExposedVariable('values', []);
      } else {
        // Select all options
        const allOptionsExceptSelectAll = selectOptions.filter((option) => option.value !== selectAllOption.value);
        setSelected(allOptionsExceptSelectAll);
        setExposedVariable(
          'values',
          allOptionsExceptSelectAll.map((item) => item.value)
        );
      }
    } else {
      // Normal behavior for selecting/deselecting individual items
      setSelected(items);
      setExposedVariable(
        'values',
        items.map((item) => item.value)
      );
    }

    fireEvent('onSelect');
  };

  useEffect(() => {
    setExposedVariable('isValid', isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    const exposedVariables = {
      selectOption: async function (value) {
        if (
          selectOptions.some((option) => option.value === value) &&
          !selected.some((option) => option.value === value)
        ) {
          const newSelected = [
            ...selected,
            ...selectOptions.filter(
              (option) =>
                option.value === value && !selected.map((selectedOption) => selectedOption.value).includes(value)
            ),
          ];
          setSelected(newSelected);
          setExposedVariable(
            'values',
            newSelected.map((item) => item.value)
          );
          fireEvent('onSelect');
        }
      },
      deselectOption: async function (value) {
        if (
          selectOptions.some((option) => option.value === value) &&
          selected.some((option) => option.value === value)
        ) {
          const newSelected = [
            ...selected.filter(function (item) {
              return item.value !== value;
            }),
          ];
          setSelected(newSelected);
          setExposedVariable(
            'values',
            newSelected.map((item) => item.value)
          );
          fireEvent('onSelect');
        }
      },
      clearSelections: async function () {
        if (selected.length >= 1) {
          setSelected([]);
          setExposedVariable('values', []);
          fireEvent('onSelect');
        }
      },
    };

    setExposedVariables(exposedVariables);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, setSelected]);

  // const filterOptions = (options, filter) => {
  //   setSearched(filter);

  //   if (searched !== filter) {
  //     setExposedVariable('searchText', filter);
  //     fireEvent('onSearchTextChanged');
  //   }
  //   if (!filter) return options;

  //   return options.filter(
  //     ({ label, value }) => label != null && value != null && label.toLowerCase().includes(filter.toLowerCase())
  //   );
  // };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: darkMode ? 'rgb(31,40,55)' : 'white',
      minHeight: height,
      height: height,
      boxShadow: state.isFocused ? boxShadow : boxShadow,
      borderRadius: Number.parseFloat(borderRadius),
    }),
    valueContainer: (provided, _state) => ({
      ...provided,
      height: height,
      padding: '0 6px',
      justifyContent,
    }),
    input: (provided, _state) => ({
      ...provided,
      color: darkMode ? 'white' : 'black',
      margin: '0px',
    }),
    indicatorSeparator: (_state) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, _state) => ({
      ...provided,
      height: height,
    }),
    option: (provided, state) => {
      const isSelected = state.isSelected;
      console.log({ isSelected, state });

      const styles = darkMode
        ? {
            color: state.isDisabled ? '#88909698' : 'white',
            backgroundColor: isSelected ? '#3650AF' : 'rgb(31,40,55)',
            ':hover': {
              backgroundColor: state.isDisabled ? 'transparent' : isSelected ? '#1F2E64' : '#323C4B',
            },
            maxWidth: 'auto',
            minWidth: 'max-content',
          }
        : {
            backgroundColor: '#7A95FB',
            color: state.isDisabled ? '#88909694' : isSelected ? 'white' : 'black',
            ':hover': {
              backgroundColor: state.isDisabled ? 'transparent' : isSelected ? '#3650AF' : '#d8dce9',
            },
            maxWidth: 'auto',
            minWidth: 'max-content',
          };
      return {
        ...provided,
        justifyContent,
        height: 'auto',
        display: 'flex',
        flexDirection: 'rows',
        alignItems: 'center',
        ...styles,
      };
    },
    menu: (provided, _state) => ({
      ...provided,
      backgroundColor: darkMode ? 'rgb(31,40,55)' : 'white',
    }),
  };

  return (
    <>
      <div
        className="multiselect-widget row g-0"
        data-cy={dataCy}
        style={{ height, display: visibility ? '' : 'none' }}
        onFocus={() => {
          onComponentClick(this, id, component);
        }}
      >
        <div className="col-auto my-auto d-flex align-items-center">
          <label
            style={{ marginRight: label ? '1rem' : '', marginBottom: 0 }}
            className={`form-label py-1 ${darkMode ? 'text-light' : 'text-secondary'}`}
            data-cy={`multiselect-label-${component.name.toLowerCase()}`}
          >
            {label}
          </label>
        </div>
        <div className="col px-0 h-100" style={{ borderRadius: parseInt(borderRadius), boxShadow, zIndex: 9999999 }}>
          {/* <MultiSelect
          hasSelectAll={showAllOption ?? false}
          options={selectOptions}
          value={selected}
          onChange={onChangeHandler}
          labelledBy={'Select'}
          disabled={disabledState}
          className={`multiselect-box${darkMode ? ' dark dark-multiselectinput' : ''}`}
          ItemRenderer={ItemRenderer}
          filterOptions={filterOptions}
          debounceDuration={0}
          onMenuToggle={(isOpen) => {
            console.log("isOpen", isOpen)
            if (isOpen) {
              document.querySelector(`.ele-${id}`).style.zIndex = 99999999;
            } else {
              document.querySelector(`.ele-${id}`).style.zIndex = '';
            }
          }}
        /> */}
          <Select
            isDisabled={disabledState}
            value={selected}
            onChange={(e) => {
              onChangeHandler(e);
            }}
            options={selectOptions}
            // styles={customStyles}
            isLoading={properties.loadingState}
            // onInputChange={onSearchTextChange}
            onFocus={(event) => onComponentClick(event, component, id)}
            menuPortalTarget={document.body}
            placeholder={'Select'}
            isMulti={true}
            closeMenuOnSelect={false}
            isSearchable={true}
            hideSelectedOptions={false}
          />
        </div>
      </div>
      <div className={`invalid-feedback ${isValid ? '' : visibility ? 'd-flex' : 'none'}`}>{validationError || ''}</div>
    </>
  );
};
