/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import { SearchableDropdown } from './searchable_dropdown';
import { DataSource, loadDataSources, toSearchableDropdownOption, equality } from './data_source';
import { useOpenSearchDashboards } from '../../../../opensearch_dashboards_react/public';
import './data_source_select.scss';

interface DataSourceSelectProps {
  onChange: (datasource: DataSource) => void;
  selected: DataSource;
}

export const DataSourceSelect = ({ selected, onChange }: DataSourceSelectProps) => {
  const {
    services: {
      savedObjects: { client: savedObjectsClient }
    },
  } = useOpenSearchDashboards<WizardServices>();

  const [sourcesPromise, setSourcesPromise] = useState<Promise<DataSource[]>>(new Promise((res, rej) => {}));
  const [loaded, setLoaded] = useState(false);
  const [sourcesMap, setSourcesMap] = useState<{ [key:string]: DataSource }>({});
  const [selectedSource, setSelectedSource] = useState<DataSource|undefined>(undefined);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      setSourcesPromise(
        loadDataSources().then((sources) => {
          setSourcesMap((sources || []).reduce((map, next) => Object.assign(map, { [next.id]: next }), {}));
          return sources;
        })
      );
    }
  }, [selected, loaded]);

  useEffect(() => {
    if (selected !== undefined) {
      setSelectedSource(sourcesMap[selected.id]);  
    }
  }, [sourcesMap, selected]);

  function mapSourceOptionToSource (option?: { id: string }): DataSource|undefined {
    return option === undefined
      ? undefined
      :  sourcesMap[option.id];
  }

  return (
    <SearchableDropdown
      selected={toSearchableDropdownOption(selectedSource)}
      onChange={option => onChange(mapSourceOptionToSource(option))}
      prepend={i18n.translate('wizard.nav.dataSource.selector.title', {
        defaultMessage: 'Data Source',
      })}
      options={sourcesPromise.then(sources => sources.map(toSearchableDropdownOption))}
      equality={equality}
    />
  );
};
