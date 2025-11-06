import { Client, TablesDB, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const MOVIE_POSTER_URL = import.meta.env.VITE_MOVIE_POSTER_URL;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchText, movie) => {
  // Use Appwrite SDK to check if the search term exists in the database
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchText", [searchText])],
    });
    if (result.rows.length > 0) {
      // if it does, update the count
      const row = result.rows[0];
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: {
          searchText,
          count: (row.count ?? 0) + 1,
          movie_id: row.movie_id ?? movie.id,
          poster_url:
            row.poster_url ?? `${MOVIE_POSTER_URL}${movie.poster_path}`,
        },
      });
    } else {
      // if it doesn't, create a new row with the search term and count as 1
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchText,
          count: 1,
          movie_id: movie.id,
          poster_url: `${MOVIE_POSTER_URL}${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error(`Appwrite Errors: ${error}`);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows;
  } catch (error) {
    console.error(error);
  }
};
