/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import { SearchableDropdown } from './searchable_dropdown';
import { DataSource, loadDataSources, toSearchableDropdownOption, equality } from './data_source';

interface DataSourceSelectProps {
  onChange: (datasource: DataSource) => void;
  selected: DataSource;
}

export const DataSourceSelect = ({ selected, onChange }: DataSourceSelectProps) => {
  const [sourcesPromise, setSourcesPromise] = useState(undefined);
  const [selectedAsOption, setSelectedAsOption] = useState(undefined);
  console.log(selected);

  useEffect(() => {
    if (sourcesPromise === undefined) {
      setSourcesPromise(
        loadDataSources().then((sources) => {
          const options = sources.map(toSearchableDropdownOption);
          const selectedInSearchResponse = options.filter((o) => equality(o, selected))[0];
          // this happens if we can't find what was given to us as the source in the response from loadSources
          if (selectedInSearchResponse === undefined) {
            // todo: what do we do?
            console.log('here');
          }
          setSelectedAsOption(selectedInSearchResponse);
          return options;
        })
      );
    }
  }, [sourcesPromise, selected]);

  const workingPromise = sourcesPromise || Promise.resolve([]);
  workingPromise.then((dataSources) => {
    const resolvedSelectedSource = (dataSources || []).filter((source) =>
      equality(source, selected)
    )[0];
  });

  return (
    <SearchableDropdown
      selected={selectedAsOption}
      onChange={onChange}
      prepend={i18n.translate('wizard.nav.dataSource.selector.title', {
        defaultMessage: 'Data Source',
      })}
      options={workingPromise}
      equality={equality}
    />
  );
};
