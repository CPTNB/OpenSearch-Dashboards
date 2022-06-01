/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  EuiLoadingSpinner,
  EuiFormControlLayout,
  EuiPopoverTitle,
  EuiButtonEmpty,
  EuiPopover,
  EuiHighlight,
  EuiSelectable,
} from '@elastic/eui';
import './searchable_dropdown.scss';

export interface SearchableDropdownOption {
  label: string;
  searchableLabel: string;
  prepend: any;
}

interface SearchableDropdownProps {
  onChange: (selection) => void;
  options: Promise<SearchableDropdownOption[]>;
  prepend: string;
  equality: (A, B) => boolean;
}

interface RenderOptionProps {
  option: SearchableDropdownOption;
  searchValue: string;
}

type DisplayError = any;

function displayError(error: DisplayError) {
  return typeof error === 'object' ? error.toString() : <>{error}</>;
}

export const SearchableDropdown = ({
  onChange,
  equality,
  selected,
  options,
  prepend,
}: SearchableDropdownProps) => {
  const [localOptions, setLocalOptions] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const onButtonClick = () => setIsPopoverOpen(!isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  function check(selected: any, options: any[]) {
    return options.map((o) => ({
      ...o,
      checked: equality(o, selected) ? 'on' : undefined,
    }));
  }

  function selectNewOption(newOptions) {    
    let newSelection;
    for (let i = 0; i < newOptions.length; i++) {
      if (newOptions[i].checked === 'on') {
        newSelection = newOptions[i];
      }
      delete newOptions[i].checked;
    }
    onChange(newSelection);
  }

  useEffect(() => {
    options
      .then((res) => setLocalOptions(check(selected, res)))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [selected, options]);

  const listDisplay = (list, search) =>
    loading ? (
      <center>
        <EuiLoadingSpinner />
      </center>
    ) : error !== undefined ? (
      displayError(error)
    ) : (
      <>
        <EuiPopoverTitle paddingSize="s" className="wizPopoverTitle">
          {search}
        </EuiPopoverTitle>
        {list}
      </>
    );

  const selectable = (
    <div className="searchableDropdown--selectableWrapper">
      <EuiSelectable
        aria-label="Selectable options"
        searchable
        options={localOptions}
        onChange={selectNewOption}
        listProps={{
          showIcons: false,
        }}
      >
        {listDisplay}
      </EuiSelectable>
    </div>
  );

  const selectedView = (
    <EuiButtonEmpty
      color="text"
      style={{ textAlign: 'left' }}
      className="searchableDropdown--topDisplay"
      onClick={onButtonClick}
    >
      {selected === undefined ? 'select an option' : selected.displayLabel}
    </EuiButtonEmpty>
  );

  return (
    <EuiFormControlLayout
      isLoading={loading}
      fullWidth={true}
      style={{ cursor: 'pointer' }}
      prepend={prepend}
      icon={{ type: 'arrowDown', side: 'right' }}
      readOnly={true}
    >
      <div className="searchableDropdown">
        <EuiPopover button={selectedView} isOpen={isPopoverOpen} closePopover={closePopover}>
          <div className="searchableDropdown--fixedWidthChild">{selectable}</div>
        </EuiPopover>
      </div>
    </EuiFormControlLayout>
  );
};
