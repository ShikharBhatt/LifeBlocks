// set-up for navbar
export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        // text: 'NEW',
      },
    },
    {
      title: true,
      name: 'Records',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'View Records',
      url: '/records/view-records',
      icon: 'icon-drop',
    },
    {
      name: 'Share Records',
      url: '/records/share-records',
      icon: 'icon-pencil',
    },
    {
      name: 'Apply Policy',
      url: '/records/apply-policy',
      icon: 'icon-pencil',
    },
    {
      name: 'View Policy',
      url: '/records/view-policy',
      icon: 'icon-pencil',
    },
    {
      name: 'Revoke Access',
      url: '/records/revoke-access',
      icon: 'icon-pencil',
    },
  ],
};
