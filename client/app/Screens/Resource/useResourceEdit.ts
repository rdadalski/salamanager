import { RouteProp, useRoute } from "@react-navigation/native";
import { CalendarStackParamList } from "@app/navigation/CalendarNavigation";
import {
  useCreateClientMutation,
  useGetMyClientsQuery,
} from "@app/api/clients/clientsApi";
import { useEffect, useState } from "react";
import { CreateClientDto } from "@app/types";
import { useGetResourceQuery } from "@app/api/resource/resource.api";

const useResourceEdit = () => {
  const route =
    useRoute<RouteProp<CalendarStackParamList, "ResourceEditScreen">>();
  const { resourceId } = route.params;

  const { data: resource, isLoading: loadingResource } = useGetResourceQuery({
    id: resourceId,
  });

  const { data: clients, isLoading: clientsIsLoading } = useGetMyClientsQuery();

  const [price, setPrice] = useState(
    resource?.defaultPrice === 0
      ? ""
      : (resource?.defaultPrice?.toString() ?? ""),
  );

  const [assignedClients, setAssignedClients] = useState<string[]>(
    resource?.clients ?? [],
  );

  useEffect(() => {
    if (resource) {
      setPrice(
        resource.defaultPrice === 0 ? "" : resource.defaultPrice.toString(),
      );
      setAssignedClients(resource.clients || []);
    }
  }, [resource]);

  return {
    resource: { id: resourceId, ...resource },
    loadingResource,
    clients,
    clientsIsLoading,
    price,
    setPrice,
    assignedClients,
    setAssignedClients,
  };
};

export default useResourceEdit;
