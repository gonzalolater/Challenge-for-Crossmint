import axios from 'axios'

/*
 * Candidate ID definition
 */
const candidateId = '35fad6e0-e4ca-410a-8e10-96ba8f77a916'
//.env
//hide data

//Type definition

enum Color {
  BLUE = 'blue',
  RED = 'red',
  Purple = 'purple',
  White = 'white',
}

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

interface Position {
  row: number
  column: number
}

interface SoloonsPayload extends Position {
  color: Color
}

interface ComethPayload extends Position {
  direction: Direction
}

interface GoalResult {
  goal: Array<Array<string>>
}

/**
 * API integration functions
 */

/**
 * Create a new Polyanet
 * @param position
 * @returns string
 */
function createPolyanet(position: Position): Promise<string> {
  return axios
    .post(
      `https://challenge.crossmint.io/api/polyanets`,
      {
        candidateId,
        ...position,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(() => {
      return 'success'
    })
    .catch(() => {
      return createPolyanet(position)
    })
}

/**
 * Create a new Soloon
 * @param soloon
 * @returns string
 */
function createSoloon(soloon: SoloonsPayload): Promise<string> {
  return axios
    .post(
      `https://challenge.crossmint.io/api/soloons`,
      {
        candidateId,
        ...soloon,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(() => {
      return 'success'
    })
    .catch(() => {
      return createSoloon(soloon)
    })
}

/**
 * Create a new Cometh
 * @param cometh
 * @returns string
 */
function createCometh(cometh: ComethPayload): Promise<string> {
  return axios
    .post(
      `https://challenge.crossmint.io/api/comeths`,
      {
        candidateId,
        ...cometh,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(() => {
      return 'success'
    })
    .catch(() => {
      return createCometh(cometh)
    })
}

/**
 * Retrieve the goal
 * @returns GoalResult
 */
function getGoal(): Promise<GoalResult> {
  return axios
    .get(
      `https://challenge.crossmint.io/api/map/${candidateId}/goal?candidateId=${candidateId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      console.log('Error: ', error)
    })
}

async function run() {
  // Retrieve the goal results
  const result = await getGoal()

  // Transform the results in a 2d array of position and items
  const positions2d = result.goal.map((row, i) => {
    return row.map((col, j) => {
      if (col !== 'SPACE') {
        return {
          row: i,
          column: j,
          item: col,
        }
      } else {
        return null
      }
    })
  })

  // Transform 2d array into 1d array and remove all null values
  const positions = [].concat(...positions2d).filter((i) => i !== null)

  // Create the map based on position
  for (const position of positions) {
    const { item, ...rest } = position
    if (item.includes('COMETH')) {
      const direction = item.split('_')[0].toLowerCase()
      await createCometh({ ...rest, direction })
    } else if (item.includes('SOLOON')) {
      const color = item.split('_')[0].toLowerCase()
      await createSoloon({ ...rest, color })
    } else {
      await createPolyanet({ ...rest })
    }
  }
}

run()
