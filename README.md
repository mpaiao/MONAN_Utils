# MONAN Utility scripts

This repository contains a few utilities for specific pre-processing and post-processing data associated with the [_Model for Ocean-laNd-Atmosphere predictioN_ (MONAN)](https://github.com/monanadmin/MONAN-Model). The scripts in this repository are either utilities under development/testing, or scripts useful for "one and done" tasks, such as generating time-invariant input data sets. For scripts that help run MONAN on a regular basis, please refer to the [_Continuous Deployment and Continuous Testing scripts_ (scripts_CD-CT)](https://github.com/monanadmin/scripts_CD-CT) repository.

This list will be continuously updated, as new features are implemented, and as some utilities are migrated to [scripts_CD-CT](https://github.com/monanadmin/scripts_CD-CT).

# Contents

Each directory contains a set of scripts used for a specific task.

  - [GenSoilColour](https://github.com/mpaiao/MONAN_Utils/tree/main/GenSoilColour). These R scripts (with some interface for C) allow extracting soil colour data from CLM-5 surface files and making NoahMP fixed data sets, for initialising spatially heterogeneous soil albedo parameters. These data sets will only work with NoahMP versions that can read in such data sets. This is currently a [pull request](https://github.com/monanadmin/MONAN-Model/pull/18) in MONAN.

  - [GrADS_CompareRuns](https://github.com/mpaiao/MONAN_Utils/tree/main/GrADS_CompareRuns). These GrADS scripts load the post-processed output of two MONAN simulations, and plot multiple comparison plots.
