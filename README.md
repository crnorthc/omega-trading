# Omega Trading
A simulated trading web app.


## Setup - Django

1. In /omega-trading, install Django.
```
pip install django djangorestframework
```

## Setup - React
1. cd into omega_trading/frontend.
2. Install dependencies.
```
npm i webpack webpack-cli --save-dev
```
```
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
```
```
npm i react react-dom --save-dev
```
```
npm install @babel/plugin-proposal-class-properties1
```
```
npm install react-router-dom
```

## GitHub
### Setup
1. Open terminal and cd to the location you would like to home the folder.
2. Clone repository (creates a copy locally in the location selcted in previous step).
```
git clone https://github.com/crnorthc/omega-trading.git
```

### Workflow - Github
** In project directory (/omega-trading) **
1. Before making changes, pull the updated version.
```
git pull origin main
```
2. After working, stage your changes.
```
git add .
```
3. Commit the changes.
```
git commit -m "message"
```
4. Upload changes to github.
```
git push origin
```

## Running Project

### Django

- cd into omega-trading/omega_trading

```
python manage.py runserver
```

### React

- cd into omega-trading/omega_trading/frontend

```
npm run dev
```