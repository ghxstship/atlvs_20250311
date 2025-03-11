import { HistoryFilters } from '../components/history/HistoryFilter';

type Operator = 'AND' | 'OR' | 'NOT';
type Comparison = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'CONTAINS' | 'STARTS' | 'ENDS';

interface Token {
  type: 'field' | 'operator' | 'comparison' | 'value' | 'group';
  value: string;
}

interface ParsedQuery {
  field: string;
  comparison: Comparison;
  value: string;
  operator?: Operator;
}

export function parseSearchQuery(query: string): ParsedQuery[] {
  const tokens = tokenize(query);
  return parse(tokens);
}

function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  const regex = /(\w+:|\(|\)|AND|OR|NOT|=|!=|>|<|>=|<=|CONTAINS|STARTS|ENDS|"[^"]*"|'[^']*'|\S+)/g;
  let match;

  while ((match = regex.exec(query)) !== null) {
    let value = match[1];
    
    if (value.endsWith(':')) {
      tokens.push({ type: 'field', value: value.slice(0, -1) });
    } else if (['AND', 'OR', 'NOT'].includes(value)) {
      tokens.push({ type: 'operator', value });
    } else if (['=', '!=', '>', '<', '>=', '<=', 'CONTAINS', 'STARTS', 'ENDS'].includes(value)) {
      tokens.push({ type: 'comparison', value });
    } else if (value.startsWith('"') || value.startsWith("'")) {
      tokens.push({ type: 'value', value: value.slice(1, -1) });
    } else if (value === '(' || value === ')') {
      tokens.push({ type: 'group', value });
    } else {
      tokens.push({ type: 'value', value });
    }
  }

  return tokens;
}

function parse(tokens: Token[]): ParsedQuery[] {
  const queries: ParsedQuery[] = [];
  let currentQuery: Partial<ParsedQuery> = {};
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === 'field') {
      if (Object.keys(currentQuery).length > 0) {
        queries.push(currentQuery as ParsedQuery);
        currentQuery = {};
      }
      currentQuery.field = token.value;
    } else if (token.type === 'comparison') {
      currentQuery.comparison = token.value as Comparison;
    } else if (token.type === 'value') {
      currentQuery.value = token.value;
      if (i + 1 < tokens.length && tokens[i + 1].type === 'operator') {
        currentQuery.operator = tokens[i + 1].value as Operator;
        i++;
      }
      queries.push(currentQuery as ParsedQuery);
      currentQuery = {};
    } else if (token.type === 'operator') {
      currentQuery.operator = token.value as Operator;
    }

    i++;
  }

  if (Object.keys(currentQuery).length > 0) {
    queries.push(currentQuery as ParsedQuery);
  }

  return queries;
}

export function applyParsedQuery(data: any[], queries: ParsedQuery[]): any[] {
  return data.filter(item => {
    let result = true;
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const value = item[query.field];
      let matches = false;

      switch (query.comparison) {
        case '=':
          matches = value === query.value;
          break;
        case '!=':
          matches = value !== query.value;
          break;
        case '>':
          matches = value > query.value;
          break;
        case '<':
          matches = value < query.value;
          break;
        case '>=':
          matches = value >= query.value;
          break;
        case '<=':
          matches = value <= query.value;
          break;
        case 'CONTAINS':
          matches = String(value).toLowerCase().includes(query.value.toLowerCase());
          break;
        case 'STARTS':
          matches = String(value).toLowerCase().startsWith(query.value.toLowerCase());
          break;
        case 'ENDS':
          matches = String(value).toLowerCase().endsWith(query.value.toLowerCase());
          break;
      }

      if (query.operator === 'AND') {
        result = result && matches;
      } else if (query.operator === 'OR') {
        result = result || matches;
      } else if (query.operator === 'NOT') {
        result = result && !matches;
      } else {
        result = matches;
      }
    }

    return result;
  });
}