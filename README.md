# Omega Trading
A simulated trading web app.


## Setup

```
pip install django djangorestframework
```
```
django-admin starproject omega_trading
```
```
cd omega_trading
```
```
django-admin startapp api
```

- In *omega-trading/omega_trading/omega_trading/setting.py* add 'api.apps.ApiConfig' into **INSTALLED_APPS**

## GitHub
### Setup
1. Open terminal and cd to the location you would like to home the folder.
2. Clone repository (creates a copy locally in the location selcted in previous step).
```
git clone https://github.com/crnorthc/omega-trading.git
```

### Workflow 
1. Before making changes, pull the updated version.
```
git pull origin
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