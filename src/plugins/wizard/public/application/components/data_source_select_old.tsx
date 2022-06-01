/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import {
  EuiFieldSearch,
  EuiLoadingSpinner,
  EuiPopoverTitle,
  EuiFormControlLayout,
  EuiButton,
  EuiPopover,
  EuiText,
} from '@elastic/eui';
import { SavedObjectsStart } from 'src/plugins/saved_objects/public';
import './data_source_select.scss';
import { loadDataSources } from './data_source';

// TODO: do this better
const outerFieldWidth = 340;
const rightArrowWidth = 36;

interface DataSourceSelectProps {
  savedObjectsClient: SavedObjectsStart;
  selected: DataSource;
  onSelect: (source: DataSource) => void;
}

// todo?
type ErrorType = any;

// todo?
const DisplayError = ({ error }: { error: ErrorType }) => {
  return <EuiText color="danger">{error}</EuiText>;
};

const SelectListItem = ({ children }: any) => {
  return (
    <button
      type="button"
      id="minor"
      aria-selected="true"
      role="option"
      className="euiSelectableListItem  euiSuperSelect__item"
    >
      {children}
    </button>
  );
};

export const DataSourceSelect = ({
  savedObjectsClient,
  selected,
  onSelect,
}: DataSourceSelectProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(undefined);
  const [dataSources, setDataSources] = useState<DataSource[] | undefined>(undefined);

  useEffect(() => {
    if (!loading && !error && !dataSources) {
      loadDataSources()
        .then((sources) => setDataSources(sources))
        .catch((e) => setError(e))
        .finally(() => setLoading(false));
      setLoading(true);
    }
  }, [loading, error, dataSources]);

  const onButtonClick = () => setIsPopoverOpen(!isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  // todo: link icon
  const dropdownWidth = outerFieldWidth - rightArrowWidth;

  const selectedDataSource = (
    <div
      style={{
        width: dropdownWidth,
        paddingLeft: 12,
        paddingTop: 12,
        paddingBottom: 12,
      }}
      onClick={onButtonClick}
      // todo: not totally sure what this does
      onKeyDown={() => {}}
    >
      <DataSourceDisplay dataSource={selected} />
    </div>
  );

  const dataSourceOptionsDisplay =
    loading || dataSources === undefined ? (
      <center>
        <EuiLoadingSpinner />
      </center>
    ) : error ? (
      <DisplayError error={error} />
    ) : (
      <div className="wizDatasourceOptions euiSelectableList__list">
        {dataSources
          .filter((source) => source.id.indexOf(searchText) > -1)
          .map((source, i) => (
            <SelectListItem key={i}>
              {' '}
              <DataSourceDisplay dataSource={source} />{' '}
            </SelectListItem>
          ))}
      </div>
    );

  const dataSourceDisplay = (
    <EuiFormControlLayout
      isLoading={loading}
      fullWidth={true}
      style={{ cursor: 'pointer' }}
      prepend={i18n.translate('wizard.nav.dataSource.selector.title', {
        defaultMessage: 'Data Source',
      })}
      icon={{ type: 'arrowDown', side: 'right' }}
      readOnly={true}
    >
      <div className="wizPopoverWrapper" style={{ maxWidth: outerFieldWidth }}>
        <EuiPopover button={selectedDataSource} isOpen={isPopoverOpen} closePopover={closePopover}>
          <div style={{ width: dropdownWidth }}>
            <EuiPopoverTitle paddingSize="s" className="wizPopoverTitle">
              <EuiFieldSearch
                compressed
                isLoading={loading}
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                isClearable
              />
            </EuiPopoverTitle>
            {dataSourceOptionsDisplay}
          </div>
        </EuiPopover>
      </div>
    </EuiFormControlLayout>
  );

  return dataSourceDisplay;
};
