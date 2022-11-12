export const infoCardBuilder = ({}) => {
  return {
    components: [],
    embeds: [userProfile],
  };
};
const userProfile = ({ userName, timestamp= new Date() }) => {
  
  return {
    type: "rich",
    title: `Profile - ${userName}`,
    description: `Paragon Path - Hunter\nTotal Item Level - 81,404\n☑️ Masterworks\n☑️ Raptors(Power)`,
    color: 0xffa200,
    timestamp,
    thumbnail: {
      url: `https://www.dasithsblog.com/images/Ranger-Hunter-Build.png`,
      height: 0,
      width: 0,
    },
    author: {
      name: `${userName}`,
    },
    fields: [ 
     
    ],
    footer: {
      text: ``,
    },
  };
};
