import {
  ArtifactsList,
  DebuffArtifactsNames,
} from "../../../../embeds/templates/artifactsList";

const fieldSorter = (fields) => (a, b) =>
  fields
    .map((field) => {
      let order = 1;
      if (field[0] === "-") {
        order = -1;
        field = field.substring(1);
      }
      return a[field] > b[field] ? order : a[field] < b[field] ? -order : 0;
    })
    .reduce((p, n) => (p ? p : n), 0);

export const artifactsSort = (artifactsList) => {
  const artifactRepeatCount = artifactsList.reduce(
    (acc, { name, artifacts, category }) => {
      const updatedArtifactCount = artifacts.reduce(
        (previous, currentArtifact) => {
          const updatableUsers = [
            ...(previous?.[currentArtifact]?.users || []),
            {
              name,
              listedArtifacts: artifacts,
              artifactsCount: artifacts.length,
            },
          ];
          const sortedUpdatableUsers = updatableUsers.sort(
            fieldSorter(["artifactsCount"])
          );
          return {
            ...previous,
            [currentArtifact]: {
              count: (previous?.[currentArtifact]?.count || 0) + 1,
              priority:
                ArtifactsList.find(
                  ({ shortName }) => currentArtifact === shortName
                )?.priority || 0,
              categoryCount: {
                ...((previous as any)?.[currentArtifact]?.categoryCount || {}),
                [category]:
                  ((previous as any)?.[currentArtifact]?.categoryCount?.[
                    category
                  ] || 0) + 1,
              },
              users: sortedUpdatableUsers,
            },
          };
        },
        acc
      );
      return { ...acc, ...updatedArtifactCount };
    },
    {}
  );

  const artifactsSortableArray = Object.keys(artifactRepeatCount).map(
    (artifactName) => {
      return {
        artifactName,
        usersCount: artifactRepeatCount[artifactName]?.users.length,
        ...artifactRepeatCount[artifactName],
      };
    }
  );

  const result = artifactsSortableArray.sort(
    fieldSorter(["priority", "count", "usersCount"])
  );
  const assignedArtifacts = result.reduce(
    (accumulated, { artifactName, users }, index) => {
      const foundUser = users.find(
        ({ name }) => !(accumulated?.assignedUsers || []).includes(name)
      );
      return {
        data: [
          ...(accumulated?.data || []),
          {
            artifactName,
            user: foundUser?.name,
          },
        ],
        ...(index < result.length - 1 && {
          assignedUsers: [
            ...(accumulated?.assignedUsers || []),
            foundUser?.name,
          ],
        }),
      };
    },
    {}
  );
  return assignedArtifacts.data;
};
