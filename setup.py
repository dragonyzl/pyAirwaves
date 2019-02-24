from setuptools import setup

setup(
    name="pyAirwaves",
    version="0.1",
    license="AGPL3",
    python_requires=">=3.6",
    long_description=open("README.md").read(),
    url="https://github.com/rhaamo/pyAirwaves",
    author="Dashie",
    author_email="dashie@sigpipe.me",
    install_requires=[
        "Flask",
        "SQLAlchemy",
        "SQLAlchemy-Searchable",
        "SQLAlchemy-Utils",
        "SQLAlchemy-Continuum",
        "Bootstrap-Flask",
        "Flask-DebugToolbar",
        "Flask-Mail",
        "Flask-Migrate",
        "Flask-SQLAlchemy",
        "bcrypt",
        "psycopg2-binary",
        "unidecode",
        "Flask_Babelex",
        "texttable",
        "python-slugify",
        "python-magic",
        "redis",
        "flask-socketio",
        "pycurl"
    ],
    setup_requires=["pytest-runner"],
    tests_require=["pytest", "pytest-cov", "jsonschema"],
)
