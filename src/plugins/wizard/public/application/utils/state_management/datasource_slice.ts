/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IndexPattern } from 'src/plugins/data/common';
import { WizardServices, DataSource } from '../../../types';
import {
  IndexPatternField,
  OSD_FIELD_TYPES,
  DataPublicPluginStart,
} from '../../../../../data/public';

const ALLOWED_FIELDS: string[] = [OSD_FIELD_TYPES.STRING, OSD_FIELD_TYPES.NUMBER];

interface DataSourceState {
  dataSource?: DataSource;
  dataSources: DataSource[];
  visualizableFields: IndexPatternField[];
  searchField: string;
}

const initialState: DataSourceState = {
  dataSource: undefined,
  dataSources: [],
  visualizableFields: [],
  searchField: '',
};

async function loadDataSources(data: DataPublicPluginStart): Promise<DataSource[]> {
  const patternIds = await data.indexPatterns.getIds();
  const patterns = await Promise.all((patternIds || []).map((id) => data.indexPatterns.get(id)));
  return patterns.map((p: IndexPattern) => ({
    fields: p.fields.filter(isVisualizable),
    title: p.title,
    id: p.id!,
    type: 'INDEX_PATTERN',
  }));
}

export const getPreloadedState = async ({ data }: WizardServices): Promise<DataSourceState> => {
  const preloadedState = { ...initialState };

  const [defaultSource, dataSources] = await Promise.all([
    data.indexPatterns.getDefault(),
    loadDataSources(data),
  ]);

  if (defaultSource) {
    // hard cast because IndexPatterns have an optional id which shouldn't ever be undefined
    preloadedState.dataSource = defaultSource as DataSource;
    preloadedState.dataSources = dataSources;
    preloadedState.visualizableFields = defaultSource.fields.filter(isVisualizable);
  }

  return preloadedState;
};

export const slice = createSlice({
  name: 'dataSource',
  initialState,
  reducers: {
    setDataSourceId: (state, action: PayloadAction<string>) => {
      const newSource = state.dataSources.filter((ds) => ds.id === action.payload)[0];
      if (newSource !== undefined) {
        state.visualizableFields = newSource.fields;
      }
      state.dataSource = newSource;
    },
    setSearchField: (state, action: PayloadAction<string>) => {
      state.searchField = action.payload;
    },
  },
});

export const { reducer } = slice;
export const { setDataSourceId, setSearchField } = slice.actions;

// TODO: Temporary validate function
// Need to identify how to get fieldCounts to use the standard filter and group functions
function isVisualizable(field: IndexPatternField): boolean {
  const isAggregatable = field.aggregatable === true;
  const isNotScripted = !field.scripted;
  const isAllowed = ALLOWED_FIELDS.includes(field.type);

  return isAggregatable && isNotScripted && isAllowed;
}
