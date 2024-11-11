# kit-start
## Structure
Feature-sliced design has been taken to this project:
```sh
kit-start/
├── node_modules/
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── ...
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Header/
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── HomePage/
│   │   │   ├── AboutPage/
│   │   │   └── ...
│   │   └── ...
│   ├── config/
│   │   ├── env.config.js
│   │   └── ...
│   ├── constants/
│   │   ├── routes.js
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── ...
│   ├── services/
│   │   ├── api.js
│   │   └── ...
│   ├── styles/
│   │   ├── global.css
│   │   ├── mixins.css
│   │   └── ...
│   ├── utils/
│   │   ├── formatDate.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── index.html
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner
