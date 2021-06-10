import { CategoryClient} from "./client";

import { fetch } from "./fetch";


const apiurl = "http://localhost:4888";
export const API = {
  categoryClient: new CategoryClient(apiurl, {fetch:fetch}),
};
