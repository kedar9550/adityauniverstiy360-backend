exports.getEligibleRoles = (school, department) => {

    let roles = [];

    if (!school) {
        return [
            "associate_dean_soe",
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

    if (school && school.toUpperCase() === "SOE") {



        //  department empty = all departments
        if (!department || department === "") {
            roles.push("associate_dean_soe", "associate_dean_fe");
        }

        else if (
            department === "FED-1" ||
            department === "FED-2" ||
            department === "FED-3" ||
            department === "FED-4" ||
            department === "FED-5"
        ) {
            roles.push("associate_dean_fe");
            roles.push("hod");
        }

        else {
            roles.push("associate_dean_soe");
            roles.push("hod");
        }

        roles.push("registrar", "pro_vc_academics", "pro_vc_es", "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir");

    }

    else if (school === "SOS") {

        roles = [
            "associate_dean_sos",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es", "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir"
        ];

    }

    else if (school === "SOP") {

        roles = [
            "dean_sop",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es", "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir"
        ];

    }

    else if (school === "SOB") {

        roles = [
            "associate_dean_sob",
            "registrar",
            "pro_vc_academics",
            "pro_vc_es",
            "pro_vc_sp", "dean_r&c", "dean_careers", "dean_student_affairs", "dean_admissions", "dean_administration", "dean_iqac", "CoE", "dean_ir"
        ];

    }

    return roles;

};