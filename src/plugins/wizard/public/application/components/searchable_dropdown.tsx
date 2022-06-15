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
  EuiSelectable,
  EuiTextColor,
} from '@elastic/eui';
import './searchable_dropdown.scss';

export interface SearchableDropdownOption {
  id: string;
  label: string;
  searchableLabel: string;
  prepend: any;
}

interface SearchableDropdownProps {
  selected?: SearchableDropdownOption;
  onChange: (selection) => void;
  options: Promise<SearchableDropdownOption[]>;
  prepend: string;
  equality: (A, B) => boolean;
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
  const [localOptions, setLocalOptions] = useState<any[] | undefined>(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const onButtonClick = () => setIsPopoverOpen(!isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  function selectNewOption(newOptions) {
    // alright, the EUI Selectable is pretty ratchet
    // this is as smarmy as it is because it needs to be

    // first go through and count all the "checked" options
    const selectedCount = newOptions.filter((o) => o.checked === 'on').length;

    // if the count is 0, the user just "unchecked" our selection and we can just do nothing
    if (selectedCount === 0) {
      setIsPopoverOpen(false);
      return;
    }
    // then, if there's more than two selections, the Selectable left the previous selection as "checked"
    // so we need to go and "uncheck" it
    for (let i = 0; i < newOptions.length; i++) {
      if (equality(newOptions[i], selected) && selectedCount > 1) {
        delete newOptions[i].checked;
      }
    }

    // finally, we can pick the checked option as the actual selection
    const newSelection = newOptions.filter((o) => o.checked === 'on')[0];

    setLocalOptions(newOptions);
    setIsPopoverOpen(false);
    onChange(newSelection);
  }

  useEffect(() => {
    options
      .then((res) =>
        setLocalOptions(
          res.map((o) => ({
            ...o,
            checked: equality(o, selected) ? 'on' : undefined,
          }))
        )
      )
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [selected, options, loading, equality]);

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

  const selectedText =
    selected === undefined ? (
      <EuiTextColor color="subdued">{loading ? 'Loading' : 'Select an option'}</EuiTextColor>
    ) : (
      <>
        {selected.prepend} {selected.label}
      </>
    );

  const selectedView = (
    <EuiButtonEmpty
      color="text"
      style={{ textAlign: 'left' }}
      className="searchableDropdown--topDisplay"
      onClick={onButtonClick}
    >
      {selectedText}
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
