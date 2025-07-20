
import { Draw } from "./DrawHelper";
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

export const getDbList = <DrawType extends Draw, >(collectionName: string) => {
  return useQuery(api.draws.list, { collection: collectionName });
};

export const saveDbItem = <DrawType extends Draw, >(collectionName: string, item: DrawType) => {
  const save = useMutation(api.draws.save);
  save({ collection: collectionName, ...item });
};

export const deleteDbItem = (collectionName: string, id: string) => {
  const remove = useMutation(api.draws.remove);
  remove({ collection: collectionName, id });
};