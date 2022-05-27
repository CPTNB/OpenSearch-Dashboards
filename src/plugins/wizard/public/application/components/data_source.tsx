
import { SearchableDropdownOption } from './searchable_dropdown';

type DataSourceType = 'INDEX_PATTERN'; //todo: others

export type DataSource = {
  id: string;
  type: DataSourceType
};

function iconForType (type: DataSourceType) {
  //todo
  return 'idx';
}

const mockDataSources: DataSource[] = [
  {
    id: 'data_source_one',
    type: 'INDEX_PATTERN'
  },
  {
    id: 'data_source_two',
    type: 'INDEX_PATTERN'
  },
  {
    id: 'data_source_three',
    type: 'INDEX_PATTERN'
  },
  {
    id: 'data_source_four',
    type: 'INDEX_PATTERN'
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

export function equality (A?: DataSource, B?: DataSource): boolean {
  return !A || !B
    ? false
    : A.id === B.id;
}

export function toSearchableDropdownOption (datasource: DataSource): SearchableDropdownOption {
  return {
    label: datasource.id,
    searchableLabel: datasource.id,

    // todo: icons indicating type
    prepend: iconForType(datasource.type)
  };
}
