export const userProfile = {
  title: "My Profile",
  custom_id: "user_profile",
  components: [
    {
      type: 1,
      components: [
        {
          type: 4,
          custom_id: "handle_name",
          label: "In Game @Handle",
          style: 1,
          min_length: 4,
          max_length: 40,
          placeholder: "@dasi123",
          required: false,
        },
      ],
    },
  ],
};
