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

// TODO: do this better
const outerFieldWidth = 340;
const rightArrowWidth = 36;

interface DataSourceSelectProps {
  savedObjectsClient: SavedObjectsStart;
  selected: DataSource;
  onSelect: (source: DataSource) => void;
}

// selection?
// todo
interface DataSource {
  id: string;
}

// todo?
type ErrorType = any;

// todo?
const DisplayError = ({ error }: { error: ErrorType }) => {
  return <EuiText color="danger">{error}</EuiText>;
};

// todo: icons indicating type
const DataSourceDisplay = ({ dataSource }: { dataSource: DataSource }) => {
  return <div className="wizDatasource"> {dataSource.id} </div>;
};

const mockDataSources: DataSource[] = [
  {
    id: 'data_source_one',
  },
  {
    id: 'data_source_two',
  },
  {
    id: 'data_source_three',
  },
  {
    id: 'data_source_four',
  },
];

async function getMockDataSources() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(mockDataSources), 2000);
  });
}

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

  async function loadDataSources() {
    // todo
    // todo: probably put this in Redux state
    // but if we want to use it elsewhere then we kinda want to not use redux..
    return getMockDataSources();
  }

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

  // todo: loading icon?
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
      <EuiLoadingSpinner /> // todo: center this?
    ) : error ? (
      <DisplayError error={error} />
    ) : (
      dataSources
        .filter((source) => source.id.indexOf(searchText) > -1)
        // todo: make a select item thing and put it here
        .map((source, i) => (
          <div key={i}>
            <DataSourceDisplay dataSource={source} />
          </div>
        ))
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
            <EuiPopoverTitle paddingSize="s">
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
