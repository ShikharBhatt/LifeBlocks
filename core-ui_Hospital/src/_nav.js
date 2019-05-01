let j = {};

if(sessionStorage.getItem("orgType") === "Hospital")
{
   j = {
    items: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        badge: {
          variant: 'info',
          text: 'Hosp',
        },
      },
      {
        title: true,
        name: 'My Recs',
        wrapper: {            // optional wrapper object
          element: '',        // required valid HTML5 element tag
          attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
        },
        class: ''             // optional class names space delimited list for title item ex: "text-center"
      },
    ],
  };
  
}

  else if(sessionStorage.getItem("orgType") === "Insurance")
  {
     j = {
      items: [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            text: 'Ins',
          },
        },
        
        {
          name: 'Deploy Policy',
          url: '/Policy/DeployPolicy',
          icon: 'icon-drop',
        },
        {
          name: 'Accept Policy',
          url: '/Policy/AcceptPolicy',
          icon: 'icon-drop',
        },
        {
          name: 'View Policy',
          url: '/Policy/ViewPolicy',
          icon: 'icon-drop',
        },
      ],
    };
  }
  


export default j;