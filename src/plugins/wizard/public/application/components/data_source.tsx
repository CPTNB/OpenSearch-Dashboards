/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { EuiIcon } from '@elastic/eui';
import { SearchableDropdownOption } from './searchable_dropdown';

type DataSourceType = 'INDEX_PATTERN'; // todo: others: | 'SAVED_SEARCH';

export interface DataSource {
  id: string;
  type: DataSourceType;
  fields: { isVisualizable: boolean }[]
}

function iconForType(type: DataSourceType) {
  return <EuiIcon type="aggregate" />;
}

const mockDataSources: DataSource[] = [
  {
    id: 'data_source_onedata_source_onedata_source_onedata_source_onedata_source_onedata_source_onedata_source_onedata_source_onedata_source_onedata_source_onedata_source_onedata_source_one',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_two',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_three',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_four',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_five',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_six',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_seven',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_eight',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_nine',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_ten',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_eleven',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_twelve',
    type: 'INDEX_PATTERN',
    fields: []
  },
  {
    id: 'data_source_thirteen',
    type: 'INDEX_PATTERN',
    fields: []
  },
];

async function getMockDataSources() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(mockDataSources), 2000);
  });
}


export async function loadDataSources() {
  // todo
  return getMockDataSources();
}

export function equality(A?: DataSource, B?: DataSource): boolean {
  return !A || !B ? false : A.id === B.id;
}

export function toSearchableDropdownOption(datasource?: DataSource): SearchableDropdownOption|undefined {
  if (datasource === undefined) {
    return undefined;
  }
  return {
    id: datasource.id,
    label: datasource.id,
    searchableLabel: datasource.id,
    prepend: iconForType(datasource.type),
  };
}
