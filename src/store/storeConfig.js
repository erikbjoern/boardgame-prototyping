import actions from './actions'
import mutations from './mutations'
import grid from './modules/grid'
import resources from './modules/resources'
import landscapes from './modules/landscapes'
import board from './modules/board'
import preferences from './modules/preferences'

const initialState = {
  root: {
    firestoreId: '',
    isAwaitingFirstGridBuild: true,
    useInitialState: false,
    viewportWidth: window.visualViewport?.width || 1400,
    keysPressed: [],
    hasFocusedInput: false,
    draggableIsBeingDragged: false,
    draggableIsOnDropzone: false,
  },
  appState: {},
  board: {
    tileRows: [],
    tileRowsStash: [],
    selectedTiles: [],
    draggableItems: [],
    colors: {
      landscapes: [],
      resources: [],
    }
  },
  grid: {
    rowCount: 13,
    columnCount: 13,
    gap: 0,
    tileBorderWidth: 6,
    scale: 1,
  },
  resources: {
    data: [
      {
        name: 'sten',
        color: '#252627',
      },
      {
        name: 'trä',
        color: '#47352c',
      },
      {
        name: 'mat',
        color: '#681717',
      },
    ],
  },
  landscapes: {
    data: [
      {
        name: 'skog',
        color: '#455B37',
        fraction: 2,
        resources: [
          {
            name: 'trä',
            min: 4,
            max: 5,
          },
          {
            name: 'sten',
            min: 1,
            max: 2,
          },
          {
            name: 'mat',
            min: 2,
            max: 3,
          },
        ],
      },
      {
        name: 'fält',
        color: '#81996D',
        fraction: 3,
        resources: [
          {
            name: 'trä',
            min: 0,
            max: 1,
          },
          {
            name: 'sten',
            min: 0,
            max: 1,
          },
          {
            name: 'mat',
            min: 5,
            max: 7,
          },
        ],
      },
      {
        name: 'berg',
        color: '#919191',
        fraction: 1,
        resources: [
          {
            name: 'trä',
            min: 1,
            max: 3,
          },
          {
            name: 'sten',
            min: 3,
            max: 5,
          },
          {
            name: 'mat',
            min: 1,
            max: 3,
          },
        ],
      },
    ],
  },
  preferences: {
    showOverview: true,
    showResourceValues: false,
    showSummary: true,
  },
}

export class StoreConfig {
  constructor() {
    this.initialState = initialState
  }

  create(args = {}) {
    return {
      state: args.rootState || this.initialState.root,
      mutations,
      actions,
      modules: {
        board,
        grid,
        landscapes,
        resources,
        preferences,
      },
    }
  }
}
