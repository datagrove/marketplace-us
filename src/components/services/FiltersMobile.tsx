import type { Accessor, Component, Setter } from "solid-js";
import { createEffect, createSignal, For, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";

import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { sortResourceTypes } from "@lib/utils/resourceSort";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;
const productCategoryData = values.subjectCategoryInfo;

let grades: Array<{ grade: string; id: number; checked: boolean }> = [];
let subjects: Array<{
    name?: string;
    subject: string;
    description?: string;
    ariaLabel?: string;
    id: number;
    checked?: boolean;
}> = [];
let subtopics: Array<{
    subtopic: string;
    id: number;
    checked: boolean;
    subject_id: number;
}> = [];
let resourceTypes: Array<{ type: string; id: number; checked: boolean }> = [];

function getFilterButtonIndexById(id: string) {
    console.log(
        values.clearFilters.filterButtons.findIndex(
            (button) => button.id === id
        )
    );
    return (
        values.clearFilters.filterButtons.findIndex(
            (button) => button.id === id
        ) || -1
    );
}

const { data: gradeData, error: gradeError } = await supabase
    .from("grade_level")
    .select("*");

if (gradeError) {
    console.log("supabase error: " + gradeError.message);
} else {
    gradeData.forEach((grade) => {
        grades.push({
            grade: grade.grade,
            id: grade.id,
            checked: false,
        });
    });
    grades.sort((a, b) => (a.id > b.id ? 0 : -1));
}

const { data: subTopicData, error: subTopicError } = await supabase
    .from("post_subtopic")
    .select("*");

if (subTopicError) {
    console.log("supabase error: " + subTopicError.message);
} else {
    subTopicData.forEach((subtopic) => {
        subtopics.push({
            subtopic: subtopic.subtopic,
            id: subtopic.id,
            checked: false,
            subject_id: subtopic.subject_id,
        });
    });
}

const { data: resourceTypesData, error: resourceTypesError } = await supabase
    .from("resource_types")
    .select("*");

if (resourceTypesError) {
    console.log("supabase error: " + resourceTypesError.message);
} else {
    sortResourceTypes(resourceTypesData);
    resourceTypesData.forEach((type) => {
        resourceTypes.push({
            type: type.type,
            id: type.id,
            checked: false,
        });
    });
    resourceTypes.sort((a, b) => (a.id > b.id ? 0 : -1));
}

const { data, error } = await supabase
    .from("post_subject")
    .select("*")
    .order("subject", { ascending: true });

if (error) {
    console.log("supabase error: " + error.message);
} else {
    data.forEach((subject) => {
        subjects.push({ subject: subject.subject, id: subject.id });
    });
}

const subjectData = productCategoryData.subjects.sort((a, b) =>
    a.name.localeCompare(b.name)
);

let allSubjectInfo: Array<{
    name: string;
    description: string;
    ariaLabel: string;
    id: number;
    checked: boolean;
}> = [];

for (let i = 0; i < subjectData.length; i++) {
    allSubjectInfo.push({
        ...subjectData[i],
        ...subjects.find(
            (itmInner) => itmInner.id === Number(subjectData[i].id)
        ),
        checked: false,
    });
}

interface Props {
    filterPostsByGrade: (grade: number) => void;
    filterPostsBySubject: (currentSubject: number) => void;
    filterPostsByResourceTypes: (type: number) => void;
    clearSubjects: () => void;
    clearGrade: () => void;
    clearResourceTypes: () => void;
    clearAllFilters: () => void;
    clearFilters: boolean;
    secularFilter: (secular: boolean) => void;
    clearSecular: () => void;
    filterPostsByDownloadable: (downloadable: boolean) => void;
    clearDownloadFilter: () => void;
    filterPostsBySubtopic: (subtopics: Array<number>) => void;
    clearSubtopics: () => void;
}

export const FiltersMobile: Component<Props> = (props) => {
    //Grades
    //Whether to show the grades window or not
    const [showGrades, setShowGrades] = createSignal(false);
    //The list of all grades
    const [grade, setGrade] =
        createSignal<Array<{ grade: string; id: number; checked: boolean }>>(
            grades
        );
    //The list of selected grades
    const [gradeFilters, setGradeFilters] = createSignal<Array<number>>([]);
    //The number of selected grades
    const [gradeFilterCount, setGradeFilterCount] = createSignal<number>(0);

    //Resource Types
    //Whether to show the resource types window or not
    const [showResourceTypes, setShowResourceTypes] = createSignal(false);
    //The list of all resource types
    const [resourceType, setResourceType] =
        createSignal<Array<{ type: string; id: number; checked: boolean }>>(
            resourceTypes
        );
    //The list of selected resource types
    const [resourceTypesFilters, setResourceTypesFilters] = createSignal<
        Array<number>
    >([]);
    //The number of selected resource types
    const [resourceTypesFilterCount, setResourceTypesFilterCount] =
        createSignal<number>(0);

    //Whether to show the filters window or not (for mobile)
    const [showFilters, setShowFilters] = createSignal(false);
    //Whether to show the filter number or not
    const [showFilterNumber, setShowFilterNumber] = createSignal(false);

    //Subjects
    //Whether to show the subjects window or not
    const [showSubjects, setShowSubjects] = createSignal(false);
    //The list of all subjects
    const [subject, setSubject] = createSignal<
        Array<{
            name: string;
            description: string;
            ariaLabel: string;
            id: number;
            checked: boolean;
        }>
    >(allSubjectInfo);
    //The list of all subtopics
    const [subtopic, setSubtopic] = createSignal<
        Array<{
            subtopic: string;
            id: number;
            checked: boolean;
            subject_id: number;
        }>
    >(subtopics);
    //The expanded subject
    const [expandedSubject, setExpandedSubject] = createSignal<number | null>(
        null
    );
    //The list of selected subjects
    const [selectedSubjects, setSelectedSubjects] = createSignal<Array<number>>(
        []
    );
    //The list of selected subtopics
    const [selectedSubtopics, setSelectedSubtopics] = createSignal<
        Array<number>
    >([]);
    //The number of selected subjects
    const [subjectFilterCount, setSubjectFilterCount] = createSignal<number>(0);

    //Secular
    //Whether to show the secular window or not
    const [showSecular, setShowSecular] = createSignal<boolean>(false);
    //Whether to filter for secular or not
    const [selectedSecular, setSelectedSecular] = createSignal<boolean>(false);
    //The number of selected secular filers (1 or 0)
    const [secularInNumber, setSecularInNumber] = createSignal<number>(0);

    //Downloadable vs External Resources
    //Whether to show the downloadable window or not
    const [showDownloadable, setShowDownloadable] =
        createSignal<boolean>(false);
    //Whether to filter for downloadable or not
    const [selectDownloadable, setSelectDownloadable] =
        createSignal<boolean>(false);
    //The number of selected downloadable filers (1 or 0)
    const [downloadableFilterNumber, setDownloadableFilterNumber] =
        createSignal<number>(0);

    const screenSize = useStore(windowSize);

    onMount(() => {
        console.log("Subtopics", subtopic());
        const localSubjects = localStorage.getItem("selectedSubjects");
        const localGrades = localStorage.getItem("selectedGrades");
        const localResourceTypes = localStorage.getItem(
            "selectedResourceTypes"
        );
        if (localSubjects !== null && localSubjects) {
            setSelectedSubjects([...JSON.parse(localSubjects).map(Number)]);
            setSubjectFilterCount(
                selectedSubjects().length + selectedSubtopics().length
            );
            checkSubjectBoxes();
        } else {
            setSelectedSubjects([]);
            subject().forEach((subject) => {
                subject.checked = false;
            });
        }
        if (localGrades !== null && localGrades) {
            setGradeFilters([...JSON.parse(localGrades).map(Number)]);
            setGradeFilterCount(gradeFilters().length);
            checkGradeBoxes();
        }

        if (localResourceTypes !== null && localResourceTypes) {
            setResourceTypesFilters([
                ...JSON.parse(localResourceTypes).map(Number),
            ]);
            setResourceTypesFilterCount(resourceTypesFilters().length);
            checkResourceTypesBoxes();
        }

        if (screenSize() !== "sm") {
            setShowFilters(true);
        }
    });

    createEffect(() => {
        if (screenSize() !== "sm") {
            setShowFilters(true);
            setShowGrades(false);
            setShowSubjects(false);
            setShowResourceTypes(false);
            setShowDownloadable(false);
        } else {
            setShowFilters(false);
        }
    });

    createEffect(() => {
        console.log("expanded subject", expandedSubject());
    });

    //Check if any filters are selected
    createEffect(() => {
        if (
            gradeFilterCount() === 0 &&
            subjectFilterCount() === 0 &&
            resourceTypesFilterCount() === 0 &&
            selectedSecular() === false &&
            selectDownloadable() === false
        ) {
            setShowFilterNumber(false);
        } else {
            setShowFilterNumber(true);
        }
    });

    function checkSubjectBoxes() {
        selectedSubjects().map((item) => {
            setSubject((prevSubject) =>
                prevSubject.map((subject) => {
                    if (subject.id === item) {
                        return { ...subject, checked: true };
                    }
                    return subject;
                })
            );
        });
    }

    function checkGradeBoxes() {
        gradeFilters().map((item) => {
            setGrade((prevGrade) =>
                prevGrade.map((grade) => {
                    if (grade.id === item) {
                        return { ...grade, checked: true };
                    }
                    return grade;
                })
            );
        });
    }

    function checkResourceTypesBoxes() {
        resourceTypesFilters().map((item) => {
            setResourceType((prevResourceType) =>
                prevResourceType.map((type) => {
                    if (type.id === item) {
                        return { ...type, checked: true };
                    }
                    return type;
                })
            );
        });
    }

    const setGradesFilter = (id: number) => {
        if (gradeFilters().includes(id)) {
            let currentGradeFilters = gradeFilters().filter((el) => el !== id);
            setGradeFilters(currentGradeFilters);
            setGradeFilterCount(gradeFilters().length);
        } else {
            setGradeFilters([...gradeFilters(), id]);
            setGradeFilterCount(gradeFilters().length);
        }
        //Refactor send the full list just let filters track the contents and send the whole thing to main
        props.filterPostsByGrade(id);

        setGrade((prevGrade) =>
            prevGrade.map((grade) => {
                if (grade.id === id) {
                    if (grade.checked) {
                        return { ...grade, checked: false };
                    } else {
                        return { ...grade, checked: true };
                    }
                }
                return grade;
            })
        );
    };

    const setResourceTypesFilter = (id: number) => {
        if (resourceTypesFilters().includes(id)) {
            let currentResourceTypesFilters = resourceTypesFilters().filter(
                (el) => el !== id
            );
            setResourceTypesFilters(currentResourceTypesFilters);
            setResourceTypesFilterCount(resourceTypesFilters().length);
        } else {
            setResourceTypesFilters([...resourceTypesFilters(), id]);
            setResourceTypesFilterCount(resourceTypesFilters().length);
        }
        //Refactor send the full list just let filters track the contents and send the whole thing to main
        props.filterPostsByResourceTypes(id);

        setResourceType((prevResourceType) =>
            prevResourceType.map((type) => {
                if (type.id === id) {
                    if (type.checked) {
                        return { ...type, checked: false };
                    } else {
                        return { ...type, checked: true };
                    }
                }
                return type;
            })
        );
    };

    const clearAllFiltersMobile = () => {
        console.log("clear all filters mobile");
        props.clearAllFilters();
        setGrade((prevGrades) =>
            prevGrades.map((grade) => ({ ...grade, checked: false }))
        );
        setResourceType((prevTypes) =>
            prevTypes.map((type) => ({ ...type, checked: false }))
        );
        setSubject((prevSubjects) =>
            prevSubjects.map((subject) => ({ ...subject, checked: false }))
        );
        setGradeFilters([]);
        setSelectedSubjects([]);
        setSelectedSubtopics([]);
        setResourceTypesFilters([]);
        setGradeFilterCount(0);
        setSubjectFilterCount(0);
        setResourceTypesFilterCount(0);
        setShowFilterNumber(false);
        setSelectedSecular(false);
        setSelectDownloadable(false);
        localStorage.removeItem("selectedGrades");
        localStorage.removeItem("selectedSubjects");
        localStorage.removeItem("selectedResourceTypes");
    };

    const clearSubtopics = () => {
        if (selectedSubtopics().length === 0) {
            return;
        } else {
            setSelectedSubtopics([]);
            props.filterPostsBySubtopic(selectedSubtopics());
        }
    };

    const clearSubjectFiltersMobile = () => {
        props.clearSubjects();
        setSubject((prevSubjects) =>
            prevSubjects.map((subject) => ({ ...subject, checked: false }))
        );
        setSubtopic((prevSubtopics) =>
            prevSubtopics.map((subtopic) => ({ ...subtopic, checked: false }))
        );
        setSelectedSubjects([]);
        setSelectedSubtopics([]);
        setSubjectFilterCount(0);
        localStorage.removeItem("selectedSubjects");
    };

    const clearSecularFilterMobile = () => {
        setSelectedSecular(false);
        props.secularFilter(selectedSecular());
        setSecularInNumber(0);
    };

    const clearGradeFiltersMobile = () => {
        props.clearGrade();
        setGrade((prevGrades) =>
            prevGrades.map((grade) => ({ ...grade, checked: false }))
        );
        setGradeFilterCount(0);
        setGradeFilters([]);
        localStorage.removeItem("selectedGrades");
    };

    const clearResourceTypesFiltersMobile = () => {
        props.clearResourceTypes();
        setResourceType((prevResourceTypes) =>
            prevResourceTypes.map((type) => ({ ...type, checked: false }))
        );
        setResourceTypesFilterCount(0);
        setResourceTypesFilters([]);
    };

    const clearDownloadableFilter = () => {
        props.clearDownloadFilter();
        setSelectDownloadable(false);
        setDownloadableFilterNumber(0);
    };

    const gradeCheckboxClick = (e: Event) => {
        let currCheckbox = e.currentTarget as HTMLInputElement;
        let currCheckboxID = Number(currCheckbox.getAttribute("data-id"));

        setGradesFilter(currCheckboxID);
    };

    const resourceTypesCheckboxClick = (e: Event) => {
        let currCheckbox = e.currentTarget as HTMLInputElement;
        let currCheckboxID = Number(currCheckbox.getAttribute("data-id"));

        setResourceTypesFilter(currCheckboxID);
    };

    const subjectCheckboxClick = (e: Event) => {
        let currCheckbox = e.currentTarget as HTMLInputElement;
        let currCheckboxID = Number(currCheckbox.getAttribute("data-id"));

        setSubjectFilter(currCheckboxID);
    };

    const secularCheckboxClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target?.checked !== null) {
            setSelectedSecular(target?.checked);
            props.secularFilter(selectedSecular());
        }
        if (selectedSecular() === true) {
            setSecularInNumber(1);
        }
    };

    const downloadableCheckboxClick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.checked !== null) {
            setSelectDownloadable(target.checked);
            props.filterPostsByDownloadable(selectDownloadable());
        }
        if (selectDownloadable() === true) {
            setDownloadableFilterNumber(1);
        } else {
            setDownloadableFilterNumber(0);
        }
    };

    function setSubjectFilter(id: number) {
        if (selectedSubjects().includes(id)) {
            let currentSubjectFilters = selectedSubjects().filter(
                (el) => el !== id
            );
            setSelectedSubjects(currentSubjectFilters);
        } else {
            setSelectedSubjects([...selectedSubjects(), id]);
        }
        setSubjectFilterCount(
            selectedSubjects().length + selectedSubtopics().length
        );
        //Refactor send the full list just let filters track the contents and send the whole thing to main
        props.filterPostsBySubject(id);

        setSubject((prevSubject) =>
            prevSubject.map((subject) => {
                if (subject.id === id) {
                    if (subject.checked) {
                        return { ...subject, checked: false };
                    } else {
                        return { ...subject, checked: true };
                    }
                }
                return subject;
            })
        );
        syncSubTopicsWithSubjects();
    }

    function updateSubtopicArray(e: Event) {
        console.log("updating subtopic array");
        const target = e.target as HTMLInputElement;
        const targetValue = Number(target.getAttribute("data-id"));
        if (target.checked === true) {
            setSelectedSubtopics([...selectedSubtopics(), targetValue]);
        } else if (target.checked === false) {
            if (selectedSubtopics().includes(targetValue)) {
                setSelectedSubtopics(
                    selectedSubtopics().filter((value) => value !== targetValue)
                );
            }
        }
        setSubjectFilterCount(
            selectedSubjects().length + selectedSubtopics().length
        );

        props.filterPostsBySubtopic(selectedSubtopics());

        setSubtopic((prevSubtopics) =>
            prevSubtopics.map((subtopic) => {
                if (subtopic.id === Number(target.getAttribute("data-id"))) {
                    if (target.checked) {
                        return { ...subtopic, checked: true };
                    } else {
                        return { ...subtopic, checked: false };
                    }
                }
                return subtopic;
            })
        );

        syncSubjectsWithSubtopics();
        console.log(selectedSubtopics());
    }

    //Track changes in selected subjects and remove subtopics if the subject is removed from the list

    const syncSubTopicsWithSubjects = () => {
        console.log("Sync subtopics with subjects");

        if (selectedSubjects().length === 0) {
            setSubtopic((prevSubtopics) =>
                prevSubtopics.map((subtopic) => ({
                    ...subtopic,
                    checked: false,
                }))
            );
            setSelectedSubtopics([]);
            props.filterPostsBySubtopic([]);
        } else {
            setSubtopic((prevSubtopics) =>
                prevSubtopics.map((subtopic) => {
                    if (
                        selectedSubjects().indexOf(subtopic.subject_id) ===
                            -1 &&
                        subtopic.checked === true
                    ) {
                        setSelectedSubtopics((prev) =>
                            prev.filter((item) => item !== subtopic.id)
                        );
                        return { ...subtopic, checked: false };
                    } else {
                        return { ...subtopic };
                    }
                })
            );
        }
    };

    createEffect(() => {
        console.log("Subjects", selectedSubjects());
    });

    createEffect(() => {
        console.log("Subtopics", selectedSubtopics());
    });

    const syncSubjectsWithSubtopics = () => {
        console.log("Sync subjects with subtopics");

        selectedSubtopics().forEach((subtopicId) => {
            const subtopicInfo = subtopic().find(
                (item) => item.id === subtopicId
            );
            if (
                subtopicInfo !== undefined &&
                selectedSubjects().indexOf(subtopicInfo.subject_id) === -1
            ) {
                setSelectedSubjects((prev) => [
                    ...prev,
                    subtopicInfo.subject_id,
                ]);
                props.filterPostsBySubject(subtopicInfo.subject_id);
                setSubject((prevSubject) => {
                    return prevSubject.map((subject) => {
                        if (subject.id === subtopicInfo.subject_id) {
                            return { ...subject, checked: true };
                        } else {
                            return subject;
                        }
                    });
                });
            }
        });
    };

    return (
        <div class="sticky top-0 z-40 h-full w-full bg-background1 px-4 pt-4 dark:bg-background1-DM md:z-0 md:w-1/4 md:min-w-[210px] md:max-w-[300px] md:px-0 md:pt-0">
            <Show when={screenSize() === "sm"}>
                <button
                    class="w-full"
                    aria-label={t("buttons.filters")}
                    onClick={() => {
                        if (
                            showGrades() === true ||
                            showSubjects() === true ||
                            showSecular() === true ||
                            showResourceTypes() === true ||
                            showDownloadable() === true
                        ) {
                            setShowGrades(false);
                            setShowSubjects(false);
                            setShowFilters(false);
                            setShowResourceTypes(false);
                            setShowDownloadable(false);
                        } else if (showFilters() === true) {
                            setShowFilters(false);
                        } else {
                            setShowFilters(true);
                        }
                    }}
                >
                    <div class="relative flex h-full items-center">
                        <svg
                            fill="none"
                            width="20px"
                            height="20px"
                            viewBox="0 0 32 32"
                            class="fill-icon1 dark:fill-icon1-DM"
                        >
                            <path d="M31.078 1.366c-0.221-0.371-0.621-0.616-1.078-0.616-0 0-0 0-0 0h-28c-0.69 0-1.25 0.56-1.25 1.25 0 0.223 0.058 0.432 0.16 0.613l-0.003-0.006 9.843 17.717v5.676c0 0.486 0.278 0.908 0.684 1.114l0.007 0.003 8 4c0.163 0.084 0.355 0.133 0.559 0.133 0.243 0 0.47-0.070 0.661-0.191l-0.005 0.003c0.359-0.223 0.594-0.615 0.594-1.062 0-0 0-0.001 0-0.001v0-9.676l9.842-17.717c0.1-0.175 0.159-0.385 0.159-0.609 0-0.233-0.064-0.452-0.176-0.638l0.003 0.006zM18.908 19.393c-0.099 0.175-0.158 0.384-0.158 0.607v7.977l-5.5-2.75v-5.227c0-0 0-0.001 0-0.002 0-0.222-0.058-0.431-0.16-0.612l0.003 0.006-8.969-16.143h23.751z"></path>
                        </svg>

                        <Show when={showFilterNumber() === true}>
                            <div class="-ml-1 flex h-5 w-5 items-center justify-center self-start rounded-full bg-btn1 dark:bg-btn1-DM">
                                <p class="text-[10px] text-ptext2 dark:text-ptext1">
                                    {gradeFilterCount() +
                                        subjectFilterCount() +
                                        resourceTypesFilterCount() +
                                        secularInNumber() +
                                        downloadableFilterNumber()}
                                </p>
                            </div>
                        </Show>

                        <h1 class="ml-2 py-2 text-xl">
                            {t("buttons.filters")}
                        </h1>
                    </div>
                </button>
            </Show>

            <div class="absolute h-full w-11/12">
                <Show when={showFilters() === true}>
                    <div class="main-pop-out relative h-96 w-full rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600 md:shadow-none">
                        <button
                            class="w-full"
                            aria-label={
                                t("formLabels.grades") +
                                " " +
                                t("buttons.filters")
                            }
                            onClick={() => {
                                setShowFilters(false);

                                // if (showSubjects() === true) {
                                //     setShowSubjects(false);
                                // }
                                setShowGrades(!showGrades());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.grades")}
                                </h2>

                                <Show when={gradeFilterCount() > 0}>
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="text-[10px] text-ptext2 dark:text-btn1Text-DM">
                                            {gradeFilterCount()}
                                        </p>
                                    </div>
                                </Show>

                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowRightIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="mr-2 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M15 18l6-6-6-6" />
                                    <path
                                        stroke-linecap="round"
                                        d="M21 12h-1"
                                    />
                                </svg>
                            </div>
                        </button>

                        {/* Resource Type Filter Outside */}

                        <button
                            class="w-full"
                            aria-label={
                                t("formLabels.resourceTypes") +
                                " " +
                                t("buttons.filters")
                            }
                            onClick={() => {
                                setShowFilters(false);

                                if (showResourceTypes() === true) {
                                    setShowResourceTypes(false);
                                }
                                setShowResourceTypes(!showResourceTypes());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.resourceTypes")}
                                </h2>

                                <Show when={resourceTypesFilterCount() > 0}>
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="text-[10px] text-ptext2 dark:text-btn1Text-DM">
                                            {resourceTypesFilterCount()}
                                        </p>
                                    </div>
                                </Show>

                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowRightIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="mr-2 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M15 18l6-6-6-6" />
                                    <path
                                        stroke-linecap="round"
                                        d="M21 12h-1"
                                    />
                                </svg>
                            </div>
                        </button>

                        <button
                            class="w-full"
                            aria-label={
                                t("formLabels.subjects") +
                                " " +
                                t("buttons.filters")
                            }
                            onClick={() => {
                                setShowFilters(false);

                                if (showGrades() === true) {
                                    setShowGrades(false);
                                }
                                setShowSubjects(!showSubjects());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.subjects")}
                                </h2>

                                <Show when={subjectFilterCount() > 0}>
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="text-[10px] text-ptext2 dark:text-btn1Text-DM">
                                            {subjectFilterCount()}
                                        </p>
                                    </div>
                                </Show>

                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowRightIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="mr-2 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M15 18l6-6-6-6" />
                                    <path
                                        stroke-linecap="round"
                                        d="M21 12h-1"
                                    />
                                </svg>
                            </div>
                        </button>

                        <button
                            class="w-full"
                            aria-label={
                                t("formLabels.secular") +
                                " " +
                                t("buttons.filters")
                            }
                            onClick={() => {
                                setShowFilters(false);
                                setShowSecular(!showSecular());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.secular")}
                                </h2>

                                <Show
                                    when={
                                        secularInNumber() > 0 &&
                                        selectedSecular() === true
                                    }
                                >
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="dark:btn1Text-DM text-[10px] text-ptext2">
                                            {secularInNumber()}
                                        </p>
                                    </div>
                                </Show>
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowRightIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="mr-2 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M15 18l6-6-6-6" />
                                    <path
                                        stroke-linecap="round"
                                        d="M21 12h-1"
                                    />
                                </svg>
                            </div>
                        </button>

                        <button
                            class="w-full"
                            aria-label={
                                t("formLabels.downloadable") +
                                " " +
                                t("buttons.filters")
                            }
                            onClick={() => {
                                setShowFilters(false);
                                setShowDownloadable(!showDownloadable());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.downloadable")}
                                </h2>

                                <Show
                                    when={
                                        downloadableFilterNumber() > 0 &&
                                        selectDownloadable() === true
                                    }
                                >
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="dark:btn1Text-DM text-[10px] text-ptext2">
                                            {downloadableFilterNumber()}
                                        </p>
                                    </div>
                                </Show>
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowRightIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="mr-2 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M15 18l6-6-6-6" />
                                    <path
                                        stroke-linecap="round"
                                        d="M21 12h-1"
                                    />
                                </svg>
                            </div>
                        </button>
                        {/* Add Additional filter menu buttons here */}

                        <div class="absolute bottom-0 my-4 mt-4 flex w-full justify-around">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearAllFiltersMobile}
                            >
                                {t(`clearFilters.filterButtons.0.text`)}
                            </button>
                            <Show when={screenSize() === "sm"}>
                                <button
                                    class="w-32 rounded border border-border1 bg-btn1 py-1 font-light text-ptext2 dark:border-border1-DM dark:bg-btn2-DM dark:text-btn1Text-DM"
                                    onClick={() => {
                                        setShowFilters(false);
                                    }}
                                >
                                    {t(
                                        `clearFilters.filterButtons.${getFilterButtonIndexById("View-Results")}.text`
                                    )}
                                </button>
                            </Show>
                        </div>
                    </div>
                </Show>

                {/* Individual filter menus */}

                {/* Resource Types */}
                <Show when={showResourceTypes() === true}>
                    <div class="max-h-96 rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600 md:max-h-max">
                        <button
                            class="w-full"
                            onClick={() => {
                                if (showFilters() === false) {
                                    setShowResourceTypes(false);
                                    setShowFilters(true);
                                }
                            }}
                        >
                            <div class="flex items-center border-b border-border1 pb-1 pl-2 dark:border-border1-DM">
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowLeftIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M9 6l-6 6 6 6" />
                                    <path stroke-linecap="round" d="M3 12h1" />
                                </svg>

                                <h2 class="flex flex-1 py-2 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.resourceTypes")}
                                </h2>
                            </div>
                        </button>

                        <div class="ml-8 mt-2 flex max-h-60 flex-wrap overflow-y-auto md:max-h-max">
                            <For each={resourceType()}>
                                {(item, index) => (
                                    <div class="flex w-5/6 flex-row flex-wrap py-1">
                                        <div class="flex items-center">
                                            <input
                                                aria-label={
                                                    item.type +
                                                    t("ariaLabels.checkbox")
                                                }
                                                type="checkbox"
                                                id={`resource-checkbox ${item.id.toString()}`}
                                                data-id={item.id}
                                                checked={item.checked}
                                                class="resourceType mr-4"
                                                onClick={(e) =>
                                                    resourceTypesCheckboxClick(
                                                        e
                                                    )
                                                }
                                            />
                                        </div>
                                        <label
                                            for={`resource-checkbox ${item.id.toString()}`}
                                            class="flex items-center"
                                        >
                                            <span class="text-lg text-ptext1 dark:text-ptext1-DM">
                                                {item.type}
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="my-2 mt-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearResourceTypesFiltersMobile}
                            >
                                {t(
                                    `clearFilters.filterButtons.${getFilterButtonIndexById("Clear-Resource-Type")}.text`
                                )}
                            </button>
                        </div>
                    </div>
                </Show>

                {/* Grades */}
                <Show when={showGrades() === true}>
                    <div class="grades-pop-out absolute rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600">
                        <button
                            class="w-full"
                            onClick={() => {
                                if (showFilters() === false) {
                                    setShowGrades(false);
                                    setShowFilters(true);
                                }
                            }}
                        >
                            <div class="flex items-center border-b border-border1 pb-1 pl-2 dark:border-border1-DM">
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowLeftIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M9 6l-6 6 6 6" />
                                    <path stroke-linecap="round" d="M3 12h1" />
                                </svg>

                                <h2 class="flex flex-1 py-2 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.grades")}
                                </h2>
                            </div>
                        </button>

                        <div class="ml-8 flex flex-wrap">
                            <For each={grade()}>
                                {(item) => (
                                    <div class="flex w-1/2 flex-row flex-wrap py-1">
                                        <div class="flex items-center">
                                            {/* TODO - capture selected checkboxes in a signal, if included pre-check them */}
                                            <input
                                                aria-label={
                                                    t(
                                                        "ariaLabels.checkboxGrade"
                                                    ) + item.grade
                                                }
                                                type="checkbox"
                                                id={`grade-checkbox ${item.id.toString()}`}
                                                data-id={item.id}
                                                checked={item.checked}
                                                class="grade mr-4 scale-125 leading-tight"
                                                // onClick={() => {
                                                //     setGradesFilter(item);
                                                //     setGradeFilterCount(
                                                //         gradeFilterCount() + 1
                                                //     );
                                                // }}
                                                onClick={(e) =>
                                                    gradeCheckboxClick(e)
                                                }
                                            />
                                        </div>
                                        <label
                                            for={`grade-checkbox ${item.id.toString()}`}
                                            class="flex items-center"
                                        >
                                            <span class="text-lg text-ptext1 dark:text-ptext1-DM">
                                                {item.grade}
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearGradeFiltersMobile}
                            >
                                {t(
                                    `clearFilters.filterButtons.${getFilterButtonIndexById("Clear-Grade")}.text`
                                )}
                            </button>
                        </div>
                    </div>
                </Show>

                {/* Secular */}
                <Show when={showSecular() === true}>
                    <div class="subjects-pop-out rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600">
                        <button
                            class="w-full"
                            onClick={() => {
                                if (showFilters() === false) {
                                    setShowSecular(false);
                                    setShowFilters(true);
                                }
                            }}
                        >
                            <div class="flex items-center border-b border-border1 pb-1 pl-2 dark:border-border1-DM">
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowLeftIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M9 6l-6 6 6 6" />
                                    <path stroke-linecap="round" d="M3 12h1" />
                                </svg>
                                <h2 class="flex flex-1 py-2 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.secular")}
                                </h2>
                            </div>
                        </button>

                        <div class="ml-8 mt-2 flex flex-wrap">
                            <div class="flex w-5/6 flex-row flex-wrap py-1">
                                <div class="flex items-center">
                                    <input
                                        type="checkbox"
                                        class={`secular mr-2 scale-125 leading-tight`}
                                        id="secular-checkbox"
                                        checked={selectedSecular()}
                                        onClick={(e) => {
                                            secularCheckboxClick(e);
                                        }}
                                    />
                                </div>
                                <label
                                    for="secular-checkbox"
                                    class="flex flex-wrap justify-between"
                                >
                                    <div class="w-4/5 px-2 ">
                                        {t("formLabels.secular")}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearSecularFilterMobile}
                            >
                                {t(
                                    `clearFilters.filterButtons.${getFilterButtonIndexById("Clear-Secular")}.text`
                                )}
                            </button>
                        </div>
                    </div>
                </Show>

                {/* Subjects */}
                <Show when={showSubjects() === true}>
                    <div class="subjects-pop-out max-h-96 rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600 md:max-h-[75svh]">
                        <button
                            class="w-full"
                            onClick={() => {
                                if (showFilters() === false) {
                                    setShowSubjects(false);
                                    setShowFilters(true);
                                }
                            }}
                        >
                            <div class="flex items-center border-b border-border1 pb-1 pl-2 dark:border-border1-DM">
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowLeftIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M9 6l-6 6 6 6" />
                                    <path stroke-linecap="round" d="M3 12h1" />
                                </svg>
                                <h2 class="flex flex-1 py-2 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.subjects")}
                                </h2>
                            </div>
                        </button>

                        <div class="max-h-[60svh] w-full overflow-y-auto pb-8 pl-2 pt-2">
                            <For each={subject()}>
                                {(subject) => (
                                    <div class="flex flex-col pb-2 pl-2">
                                        <div class="flex flex-row justify-between">
                                            <div class="mt-1 flex flex-row">
                                                <div class="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`subject-checkbox ${subject.id.toString()}`}
                                                        data-id={subject.id}
                                                        checked={
                                                            subject.checked
                                                        }
                                                        class={`mr-2 scale-125 leading-tight`}
                                                        onClick={(e) =>
                                                            subjectCheckboxClick(
                                                                e
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <label
                                                    for={`subject-checkbox ${subject.id.toString()}`}
                                                    class="flex items-center"
                                                >
                                                    <span class="text-lg text-ptext1 dark:text-ptext1-DM">
                                                        {subject.name}
                                                    </span>
                                                </label>
                                            </div>
                                            <button
                                                class={`mr-2 ${expandedSubject() === subject.id ? "hidden" : ""}`}
                                                onclick={() =>
                                                    setExpandedSubject(
                                                        subject.id
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                            <button
                                                class={`mr-2 ${expandedSubject() === subject.id ? "" : "hidden"}`}
                                                onclick={() =>
                                                    setExpandedSubject(null)
                                                }
                                            >
                                                -
                                            </button>
                                        </div>
                                        <div
                                            id="subtopicCheckboxes"
                                            class={`flex w-full flex-col items-start pb-4 pl-4 ${expandedSubject() === subject.id ? "" : "hidden"}`}
                                        >
                                            <For each={subtopic()}>
                                                {(subtopic) =>
                                                    subtopic.subject_id ===
                                                        subject.id && (
                                                        <>
                                                            <div class="mt-1 flex flex-row py-1">
                                                                <div class="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        class="block"
                                                                        id={`subtopic-checkbox ${subtopic.id.toString()}`}
                                                                        data-id={
                                                                            subtopic.id
                                                                        }
                                                                        checked={
                                                                            subtopic.checked
                                                                        }
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            updateSubtopicArray(
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <label
                                                                    for={`subtopic-checkbox ${subtopic.id.toString()}`}
                                                                    class="flex items-center"
                                                                >
                                                                    <span class=" pl-2 text-start">
                                                                        {
                                                                            subtopic.subtopic
                                                                        }
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </For>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearSubjectFiltersMobile}
                            >
                                {t(
                                    `clearFilters.filterButtons.${getFilterButtonIndexById("Clear-Subjects")}.text`
                                )}
                            </button>
                        </div>
                    </div>
                </Show>

                {/* Downloadable */}
                <Show when={showDownloadable() === true}>
                    <div class="downloadable-pop-out rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600">
                        <button
                            class="w-full"
                            onClick={() => {
                                if (showFilters() === false) {
                                    setShowDownloadable(false);
                                    setShowFilters(true);
                                }
                            }}
                        >
                            <div class="flex items-center border-b border-border1 pb-1 pl-2 dark:border-border1-DM">
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowLeftIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M9 6l-6 6 6 6" />
                                    <path stroke-linecap="round" d="M3 12h1" />
                                </svg>
                                <h2 class="flex flex-1 py-2 text-xl font-bold text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.downloadable")}
                                </h2>
                            </div>
                        </button>

                        <div class="ml-8 mt-2 flex flex-wrap">
                            <div class="flex w-5/6 flex-row flex-wrap py-1">
                                <div class="flex items-center">
                                    <input
                                        aria-label={
                                            t("formLabels.downloadable") +
                                            " " +
                                            t("ariaLabels.checkbox")
                                        }
                                        type="checkbox"
                                        id="downloadable"
                                        class={`secular mr-2 scale-125 leading-tight`}
                                        checked={selectDownloadable()}
                                        onClick={(e) => {
                                            downloadableCheckboxClick(e);
                                        }}
                                    />
                                </div>
                                <label
                                    for="downloadable"
                                    class="flex flex-wrap justify-between"
                                >
                                    <div class="w-4/5 px-2 ">
                                        {t("formLabels.downloadable")}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearDownloadableFilter}
                            >
                                {t(
                                    `clearFilters.filterButtons.${getFilterButtonIndexById("Clear-Downloadable")}.text`
                                )}
                            </button>
                        </div>
                    </div>
                </Show>

                {/* Add new filter rendering here */}
            </div>
        </div>
    );
};
