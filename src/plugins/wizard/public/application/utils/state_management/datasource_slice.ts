/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IndexPattern } from 'src/plugins/data/common';
import { WizardServices } from '../../../types';

import { IndexPatternField, OSD_FIELD_TYPES } from '../../../../../data/public';

const ALLOWED_FIELDS: string[] = [OSD_FIELD_TYPES.STRING, OSD_FIELD_TYPES.NUMBER];

interface DataSourceState {
  datasource: IndexPattern | null;
  visualizableFields: IndexPatternField[];
  searchField: string;
}

const initialState: DataSourceState = {
  datasource: null,
  visualizableFields: [],
  searchField: '',
};

export const getPreloadedState = async ({ data }: WizardServices): Promise<DataSourceState> => {
  const preloadedState = { ...initialState };

  const defaultIndexPattern = await data.indexPatterns.getDefault();
  if (defaultIndexPattern) {
    preloadedState.datasource = defaultIndexPattern;
    preloadedState.visualizableFields = defaultIndexPattern.fields.filter(isVisualizable);
  }

  return preloadedState;
};

export const slice = createSlice({
  name: 'dataSource',
  initialState,
  reducers: {
    setDataSource: (state, action: PayloadAction<IndexPattern>) => {
      // todo: difference between indexPattern and "Data Source" ?
      state.datasource = action.payload;
      state.visualizableFields = action.payload.fields.filter(isVisualizable);
    },
    setSearchField: (state, action: PayloadAction<string>) => {
      state.searchField = action.payload;
    },
  },
});

export const { reducer } = slice;
export const { setDataSource, setSearchField } = slice.actions;

// TODO: Temporary validate function
// Need to identify how to get fieldCounts to use the standard filter and group functions
function isVisualizable(field: IndexPatternField): boolean {
  const isAggregatable = field.aggregatable === true;
  const isNotScripted = !field.scripted;
  const isAllowed = ALLOWED_FIELDS.includes(field.type);

  return isAggregatable && isNotScripted && isAllowed;
}
