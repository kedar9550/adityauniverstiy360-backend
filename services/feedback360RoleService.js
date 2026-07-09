exports.getEligibleRoles = (school, department, employeeRole) => {

    let roles = [];

    if (!school) {
        return [
            "dean_soe",
            "associate_dean_soc",
            "associate_dean_fe",
            "associate_dean_sos",
            "associate_dean_sob",
            "dean_sop",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es",
            "pro_vc_sp",
            "dean_r&c",
            "dean_careers",
            "dean_student_affairs",
            "dean_admissions",
            "dean_administration",
            "dean_iqac",
            "CoE",
            "dean_ir"
        ];
    }

    if (school && school.toUpperCase() === "SOE"){

        //  department empty = all departments
        // if (!department || department === "") {
        //     roles.push("dean_soe", "associate_dean_fe");
        // }

        if (
            department === "FED-1" ||
            department === "FED-2" ||
            department === "FED-3" ||
            department === "FED-4" ||
            department === "FED-5"
        ) {
            roles.push("associate_dean_fe");
            roles.push("hod");
        }

        else if (
            department === "EEE"||
            department === "ME"||
            department === "CE"||
            department === "ECE"||
            department === "Min.E/PT"||
            department === "Ag.E"
        ) 
            {
            roles.push("dean_soe");
            roles.push("hod");
        }

        roles.push("registrar", "pro_vc_academics", "pro_vc_es", "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir");


        // Assoc Dean/Dean can also give feedback to other schools' deans (optional)
        if (employeeRole === "Assoc Dean/Dean") {
            roles.push("associate_dean_sos", "associate_dean_sob", "dean_sop","associate_dean_soc","associate_dean_fe");
        } else if (employeeRole === "Assoc Dean - SOE") {
            roles.push("associate_dean_sos", "associate_dean_sob", "dean_sop","associate_dean_soc","associate_dean_fe", "dean_soe");
        } else if (employeeRole === "Dean - SOE") {
            roles.push("associate_dean_sos", "associate_dean_sob", "dean_sop", "associate_dean_soc", "associate_dean_fe");
        }

    }

    else if (school === "SOC"){
        if (
            department === "CSE-DS/IT"||
            department === "CA"||
            department === "AI&ML"||
            department === "CSE"
           
        ) {
            roles.push("associate_dean_soc");
            roles.push("hod");
        }
    roles.push("registrar", "pro_vc_academics", "pro_vc_es", "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir");

        if (employeeRole === "Assoc Dean/Dean") {
            roles.push("dean_soe", "associate_dean_sob", "dean_sop", "associate_dean_sos","associate_dean_fe");
        }
       
    }

    else if (school === "SOS") {

        roles = [
            "associate_dean_sos",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es", "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir"
        ];

        // Assoc Dean/Dean can also give feedback to other schools' deans (optional)
        if (employeeRole === "Assoc Dean/Dean") {
            roles.push("dean_soe", "associate_dean_fe", "associate_dean_sob", "dean_sop","associate_dean_soc");
        }

    }

    else if (school === "SOP") {

        roles = [
            "dean_sop",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es", "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir"
        ];

        // Assoc Dean/Dean can also give feedback to other schools' deans (optional)
        if (employeeRole === "Assoc Dean/Dean") {
            roles.push("dean_soe", "associate_dean_fe", "associate_dean_sos", "associate_dean_sob","associate_dean_soc");
        }

    }

    else if (school === "SOB") {

        roles = [
            "associate_dean_sob",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es",
            "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir"
        ];

        // Assoc Dean/Dean can also give feedback to other schools' deans (optional)
        if (employeeRole === "Assoc Dean/Dean") {
            roles.push("dean_soe", "associate_dean_fe", "associate_dean_sos", "dean_sop","associate_dean_soc");
        }

    }
    else if (school === "UI") {

        const restrictedRoles = [
            "dean_r&c",
            "dean_careers",
            "dean_student_affairs",
            "dean_admissions",
            "dean_administration",
            "dean_iqac",
            "CoE",
            "dean_ir"
        ];

        const allRoles = [
            "dean_soe",
            "associate_dean_sos",
            "associate_dean_fe",
            "dean_sop",
            "associate_dean_sob",
            "associate_dean_soc",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es",
            "pro_vc_sp",
            "dean_r&c",
            "dean_careers",
            "dean_student_affairs",
            "dean_admissions",
            "dean_administration",
            "dean_iqac",
            "CoE",
            "dean_ir"
        ];

        // if current logged employee belongs to restricted roles
        if (restrictedRoles.includes(employeeRole)) {

            roles = allRoles.filter(
                (role) => role !== employeeRole
            );

        } else {

            roles = allRoles;

        }
    }

    return roles;

};