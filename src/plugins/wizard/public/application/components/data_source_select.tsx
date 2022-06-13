/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { EuiIcon } from '@elastic/eui';
import { SearchableDropdown, SearchableDropdownOption } from './searchable_dropdown';
import { DataSource, DataSourceType } from '../../types';
import './data_source_select.scss';
import indexPatternSvg from '../../assets/index_pattern.svg';

function iconForType(type: DataSourceType) {
  return <EuiIcon type={indexPatternSvg} />;
}

function sourceEquality(A?: SearchableDropdownOption, B?: SearchableDropdownOption): boolean {
  return !A || !B ? false : A.id === B.id;
}

function toSearchableDropdownOption(dataSource: DataSource): SearchableDropdownOption {
  return {
    id: dataSource.id,
    label: dataSource.title,
    searchableLabel: dataSource.title,
    prepend: iconForType(dataSource.type),
  };
}

interface DataSourceSelectProps {
  onChange: (dataSource?: DataSource) => void;
  selected?: DataSource;
  dataSources: DataSource[];
}

export const DataSourceSelect = ({ selected, onChange, dataSources }: DataSourceSelectProps) => {
  return (
    <SearchableDropdown
      selected={selected !== undefined ? toSearchableDropdownOption(selected) : undefined}
      onChange={(option) => onChange(dataSources.filter((s) => s.id === (option || {}).id)[0])}
      prepend={i18n.translate('wizard.nav.dataSource.selector.title', {
        defaultMessage: 'Data Source',
      })}
      options={Promise.resolve(dataSources).then((sources) =>
        sources.filter((source) => source !== undefined).map(toSearchableDropdownOption)
      )}
      equality={sourceEquality}
    />
  );
};
