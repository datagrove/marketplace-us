import type { Component } from "solid-js";
import { createEffect, createSignal, For, Show, onMount } from "solid-js";
import { useStore } from "@nanostores/solid";
import { windowSize } from "@components/common/WindowSizeStore";

import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import { SecularFilter } from "./SecularFilter";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;
const productCategoryData = values.subjectCategoryInfo;

let grades: Array<{ grade: string; id: number; checked: boolean }> = [];
let subjects: Array<any> = [];
let resourceTypes: Array<{ type: string; id: number; checked: boolean }> = [];

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

const { data: resourceTypesData, error: resourceTypesError } = await supabase
    .from("resource_types")
    .select("*");

if (resourceTypesError) {
    console.log("supabase error: " + resourceTypesError.message);
} else {
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
    id: string;
    checked: boolean;
}> = [];

for (let i = 0; i < subjectData.length; i++) {
    allSubjectInfo.push({
        ...subjectData[i],
        ...subjects.find(
            (itmInner) => itmInner.id.toString() === subjectData[i].id
        ),
        checked: false,
    });
}

interface Props {
    filterPostsByGrade: (grade: string) => void;
    filterPostsBySubject: (currentSubject: string) => void;
    filterPostsByResourceTypes: (type: string) => void;
    clearSubjects: () => void;
    clearGrade: () => void;
    clearResourceTypes: () => void;
    clearAllFilters: () => void;
    secularFilter: (secular: boolean) => void;
    clearSecular: () => void;
    downHostedFilter: (downHosted: number) => void;
    clearDownHosted: () => void;
}

export const FiltersMobile: Component<Props> = (props) => {
    const [showGrades, setShowGrades] = createSignal(false);
    const [showResourceTypes, setShowResourceTypes] = createSignal(false);
    const [showSubjects, setShowSubjects] = createSignal(false);
    const [showFilters, setShowFilters] = createSignal(false);
    const [grade, setGrade] =
        createSignal<Array<{ grade: string; id: number; checked: boolean }>>(
            grades
        );
    const [resourceType, setResourceType] =
        createSignal<Array<{ type: string; id: number; checked: boolean}>>(
           resourceTypes 
        );
    const [gradeFilters, setGradeFilters] = createSignal<Array<string>>([]);
    const [resourceTypesFilters, setResourceTypesFilters] = createSignal<Array<string>>([]);
    const [subject, setSubject] = createSignal<Array<any>>(allSubjectInfo);
    const [selectedSubjects, setSelectedSubjects] = createSignal<Array<string>>(
        []
    );
    const [gradeFilterCount, setGradeFilterCount] = createSignal<number>(0);
    const [resourceTypesFilterCount, setResourceTypesFilterCount] = createSignal<number>(0);
    const [subjectFilterCount, setSubjectFilterCount] = createSignal<number>(0);
    const [showFilterNumber, setShowFilterNumber] = createSignal(false);
    const [showSecular, setShowSecular] = createSignal<boolean>(false);
    const [selectedSecular, setSelectedSecular] = createSignal<boolean>(false);
    const [secularInNumber, setSecularInNumber] = createSignal<number>(0);
    const [showDownHosted, setShowDownHosted] = createSignal<boolean>(false);
    // 1 = searchForHostedResoruce, 2 = searchForDown
    const [selectedDownHosted, setSelectedDownHosted] = createSignal<number> (0);
    const [selectedDownHostedCheck, setSelectedDownHostedCheck] = createSignal<boolean> (false);
      const [selectedHostedCheck,setSelectedHostedCheck]= createSignal<boolean>(false)
      const [selectedDownCheck,setSelectedDownCheck] = createSignal<boolean>(false)

    const [downHostedInNumber, setDownHostedInNumber] = createSignal<number>(0);
    const screenSize = useStore(windowSize);

    onMount(() => {
        if (localStorage.getItem("selectedSubjects")) {
            setSelectedSubjects([
                ...JSON.parse(localStorage.getItem("selectedSubjects")!),
            ]);
            setSubjectFilterCount(selectedSubjects().length);
            checkSubjectBoxes();
        } else {
            setSelectedSubjects([]);
            subject().forEach((subject) => {
                subject.checked = false;
            });
        }
        if (localStorage.getItem("selectedGrades")) {
            setGradeFilters([
                ...JSON.parse(localStorage.getItem("selectedGrades")!),
            ]);
            setGradeFilterCount(gradeFilters().length);
            checkGradeBoxes();
        }
        if (localStorage.getItem("selectedResoruceType")) {
            setResourceTypesFilters([
                ...JSON.parse(localStorage.getItem("selectedResoruceType")!),
            ]);
            setResourceTypesFilterCount(resourceTypesFilters().length);
            checkResourceTypesBoxes();
        } else {

            setGradeFilters([]);
            grade().forEach((grade) => {
                grade.checked = false;
            });
        }

        if (screenSize() !== "sm") {
            setShowFilters(true);
        }
    });

    createEffect(() => {
        if (gradeFilterCount() === 0 && subjectFilterCount() === 0 && resourceTypesFilterCount() === 0 && selectedSecular() === false) {
            setShowFilterNumber(false);
        } else {
            setShowFilterNumber(true);
        }
    });

    function checkSubjectBoxes() {
        selectedSubjects().map((item) => {
            subject().map((subject) => {
                if (subject.id.toString() === item) {
                    subject.checked = true;
                }
            });
        });
    }

    function checkGradeBoxes() {
        gradeFilters().map((item) => {
            grade().map((grade) => {
                if (grade.id.toString() === item) {
                    grade.checked = true;
                }
            });
        });
    }

    function checkResourceTypesBoxes() {
        resourceTypesFilters().map((item) => {
            resourceType().map((type) => {
                if (type.id.toString() === item) {
                    type.checked = true;
                }
            });
        });
    }

    const setGradesFilter = (id: string) => {
        if (gradeFilters().includes(id)) {
            let currentGradeFilters = gradeFilters().filter((el) => el !== id);
            setGradeFilters(currentGradeFilters);
            setGradeFilterCount(gradeFilters().length);
        } else {
            setGradeFilters([...gradeFilters(), id]);
            setGradeFilterCount(gradeFilters().length);
        }
        props.filterPostsByGrade(id);

        grade().forEach((grade) => {
            if (grade.id.toString() === id) {
                if (grade.checked) {
                    grade.checked = false;
                } else {
                    grade.checked = true;
                }
            }
        });
    };


    const setResourceTypesFilter = (id: string) => {
        if (resourceTypesFilters().includes(id)) {
            let currentResourceTypesFilters = resourceTypesFilters().filter((el) => el !== id);
            setResourceTypesFilters(currentResourceTypesFilters);
            setResourceTypesFilterCount(resourceTypesFilters().length);
        } else {
            setResourceTypesFilters([...resourceTypesFilters(), id]);
            setResourceTypesFilterCount(resourceTypesFilters().length);
        }
        props.filterPostsByResourceTypes(id);

        resourceType().forEach((type) => {
            if (type.id.toString() === id) {
                if (type.checked) {
                    type.checked = false;
                } else {
                    type.checked = true;
                }
            }
        });
    };

    const clearAllFiltersMobile = () => {
        props.clearAllFilters();
        grade().forEach((grade) => {
            grade.checked = false;
        });
        subject().forEach((subject) => {
            subject.checked = false;
        });
        resourceType().forEach((type) => {
            type.checked = false;
        });
        setGradeFilters([]);
        setSelectedSubjects([]);
        setResourceTypesFilters([]);
        setGradeFilterCount(0);
        setSubjectFilterCount(0);
        setResourceTypesFilterCount(0)
        setShowFilterNumber(false);
        setSelectedSecular(false);
        setSelectedDownHosted(0);
    };

    const clearSubjectFiltersMobile = () => {
        props.clearSubjects();
        subject().forEach((subject) => {
            subject.checked = false;
        });
        setSelectedSubjects([]);
        setSubjectFilterCount(0);
    };

    const clearSecularFilterMobile = () => {
        setSelectedSecular(false);
        props.secularFilter(selectedSecular());
        setSecularInNumber(0)
    };

    const clearGradeFiltersMobile = () => {
        props.clearGrade();
        grade().forEach((grade) => {
            grade.checked = false;
        });
        setGradeFilterCount(0);
        setGradeFilters([]);
    };

    const clearResourceTypesFiltersMobile = () => {
        props.clearResourceTypes();
        resourceType().forEach((type) => {
            type.checked = false;
        });
        setResourceTypesFilterCount(0);
        setResourceTypesFilters([]);
    };

    const clearDownHostedFilterMobile = () => {
      setSelectedDownHosted(0);
      let isCheckHosted = document.getElementsByClassName("checkBoxHosted") as HTMLCollectionOf<HTMLInputElement>;
      isCheckHosted[0].checked = false
      let isCheckDown = document.getElementsByClassName("checkBoxDown") as HTMLCollectionOf<HTMLInputElement>;
      isCheckDown[0].checked = false
      setSelectedDownHostedCheck(false)
      props.downHostedFilter(selectedDownHosted()!);
      setDownHostedInNumber(0)
    };

    const gradeCheckboxClick = (e: Event) => {
        let currCheckbox = e.currentTarget as HTMLInputElement;
        let currCheckboxID = currCheckbox.id;

        setGradesFilter(currCheckboxID);
    };

    const resourceTypesCheckboxClick = (e: Event) => {
        let currCheckbox = e.currentTarget as HTMLInputElement;
        let currCheckboxID = currCheckbox.id;

        setResourceTypesFilter(currCheckboxID);
    };

    const subjectCheckboxClick = (e: Event) => {
        let currCheckbox = e.currentTarget as HTMLInputElement;
        let currCheckboxID = currCheckbox.id;

        setSubjectFilter(currCheckboxID);
    };

    const secularCheckboxClick = (e: Event) => {
        if ((e.target as HTMLInputElement)?.checked !== null) {
            setSelectedSecular((e.target as HTMLInputElement)?.checked);
            props.secularFilter(selectedSecular());
        }
        if (selectedSecular() === true){
        setSecularInNumber(1)
    }
    };

  const downHostedCheckboxClick = (e: Event) => {
     
    const isCheck = document.getElementsByClassName("checkBoxDown") as HTMLCollectionOf<HTMLInputElement>;
    console.log(isCheck[0].checked)
    if((e.target as HTMLInputElement)?.checked === true && isCheck[0].checked === false ) {
      setSelectedDownHosted(1)
      console.log("first downhosted")
        setDownHostedInNumber(1)
    props.downHostedFilter(selectedDownHosted()!);
      setSelectedHostedCheck(true)
      setSelectedDownCheck(false)
    }else if((e.target as HTMLInputElement)?.checked === false && isCheck[0].checked === false ){
      console.log("first unchecked")
      setSelectedDownHosted(0)
    props.downHostedFilter(selectedDownHosted()!);
        setDownHostedInNumber(0)
      setSelectedHostedCheck(false)
      setSelectedDownCheck(false)
    }else if((e.target as HTMLInputElement)?.checked === false && isCheck[0].checked === true){
      console.log("first unchecked but second checked")
      setSelectedDownHosted(2)
      props.downHostedFilter(selectedDownHosted()!);
        setDownHostedInNumber(1)
      setSelectedHostedCheck(false)
      setSelectedDownCheck(true)
    }else if((e.target as HTMLInputElement)?.checked === true && isCheck[0].checked === true) {
      console.log("first 4")
      setSelectedDownHosted(3)
      props.downHostedFilter(selectedDownHosted()!);
        setDownHostedInNumber(2)
      setSelectedHostedCheck(true)
      setSelectedDownCheck(true)
    }
  };


  const downCheckboxClick = (e: Event) => {
    const isCheck = document.getElementsByClassName("checkBoxHosted") as HTMLCollectionOf<HTMLInputElement>;
    console.log(isCheck[0].checked)
    if((e.target as HTMLInputElement)?.checked === true && isCheck[0].checked === false ){
      setSelectedDownHosted(2)
      console.log("second down")
    console.log(selectedDownHosted())
      props.downHostedFilter(selectedDownHosted()!);
        setDownHostedInNumber(1)
      setSelectedHostedCheck(false)
      setSelectedDownCheck(true)
    }if((e.target as HTMLInputElement)?.checked === false && isCheck[0].checked === false ){
      console.log("second unchecked")
      setSelectedDownHosted(0)
      props.downHostedFilter(selectedDownHosted()!);
        setDownHostedInNumber(0)
      setSelectedHostedCheck(false)
      setSelectedDownCheck(false)
    }if((e.target as HTMLInputElement)?.checked === false && isCheck[0].checked === true){
      console.log("second unchecked but first checked")
      setSelectedDownHosted(1)
      setSelectedHostedCheck(true)
      setSelectedDownCheck(false)
      props.downHostedFilter(selectedDownHosted()!);
        setDownHostedInNumber(1)
    }if((e.target as HTMLInputElement)?.checked === true && isCheck[0].checked === true) {
      setSelectedDownHosted(3)
      props.downHostedFilter(selectedDownHosted()!);
        setDownHostedInNumber(2)
      console.log(downHostedInNumber(),)
      setSelectedHostedCheck(true)
      setSelectedDownCheck(true)
    }
  };

    function setSubjectFilter(id: string) {
        if (selectedSubjects().includes(id)) {
            let currentSubjectFilters = selectedSubjects().filter(
                (el) => el !== id
            );
            setSelectedSubjects(currentSubjectFilters);
            setSubjectFilterCount(selectedSubjects().length);
        } else {
            setSelectedSubjects([...selectedSubjects(), id]);
            setSubjectFilterCount(selectedSubjects().length);
        }
        props.filterPostsBySubject(id);

        subject().forEach((subject) => {
            if (subject.id.toString() === id) {
                if (subject.checked) {
                    subject.checked = false;
                } else {
                    subject.checked = true;
                }
            }
        });
    }

    return (
        <div class="sticky top-0 z-40 h-full w-full bg-background1 px-4 pt-4 dark:bg-background1-DM md:z-0 md:w-[300px] md:px-0 md:pt-0">
            <Show when={screenSize() === "sm"}>
                <button
                    class="w-full"
                    onClick={() => {
                        if (
                            showGrades() === true ||
                            showSubjects() === true ||
                            showSecular() === true ||
                            showResourceTypes() === true ||
                            showDownHosted() === true
                        ) {
                            setShowGrades(false);
                            setShowSubjects(false);
                            setShowFilters(false);
                            setShowResourceTypes(false)
                            setShowSecular(false);
                            setShowDownHosted(false);
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
                                    {gradeFilterCount() + subjectFilterCount() + resourceTypesFilterCount() + secularInNumber() + downHostedInNumber() }
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
                            onClick={() => {
                                setShowFilters(false);

                                if (showSubjects() === true) {
                                    setShowSubjects(false);
                                }
                                setShowGrades(!showGrades());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.grades")}
                                </h2>

                                <Show when={gradeFilterCount() > 0}>
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">
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
                                        <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">
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
                                        <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">
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
                            onClick={() => {
                                setShowFilters(false);
                                setShowSecular(!showSecular());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.secular")}
                                </h2>

                                <Show when={secularInNumber() > 0 && selectedSecular() === true}>
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">
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
        
                        {/* downHostedFilter Outside */}
                        <button
                          class="w-full"
                          onClick={() => {
                            setShowFilters(false);
                            setShowDownHosted(!showDownHosted());
                          }}
                        >
                          <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                            <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                              {t("formLabels.downHosted")}
                            </h2>

                                <Show when={downHostedInNumber() > 0 && selectedDownHosted() > 0 }>
                                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-btn1 dark:bg-btn1-DM">
                                        <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">
                                            {downHostedInNumber()}
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

                        <div class="absolute bottom-0 my-4 mt-4 flex w-full justify-around">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearAllFiltersMobile}
                            >
                                {t("clearFilters.filterButtons.0.text")}
                            </button>
                            <Show when={screenSize() === "sm"}>
                                <button
                                    class="w-32 rounded border border-border1 bg-btn1 py-1 font-light text-ptext2 dark:border-border1-DM dark:bg-btn2-DM dark:text-ptext2-DM"
                                    onClick={() => {
                                        setShowFilters(false);
                                    }}
                                >
                                    {t("clearFilters.filterButtons.5.text")}
                                </button>
                            </Show>
                        </div>
                    </div>
                </Show>


                <Show when={showResourceTypes() === true}>
                    <div class=" absolute rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600">
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

                        <div class="ml-8 flex flex-wrap">
                            <For each={resourceType()}>
                                {(item, index) => (
                                    <div class="flex w-5/6 flex-row flex-wrap py-1">
                                        <div class="flex items-center">
                                            <input
                                                aria-label={
                                                    t(
                                                        "ariaLabels.checkboxGrade"
                                                    ) + item.type
                                                }
                                                type="checkbox"
                                                id={item.id.toString()}
                                                checked={item.checked}
                                                class="resourceType mr-4 scale-125 leading-tight"
                                                onClick={(e) =>
                                                    resourceTypesCheckboxClick(e)
                                                }
                                            />
                                        </div>
                                        <div class="flex items-center">
                                            <span class="text-lg text-ptext1 dark:text-ptext1-DM">
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearResourceTypesFiltersMobile}
                            >
                                {t("clearFilters.filterButtons.7.text")}
                            </button>
                        </div>
                    </div>
                </Show>

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
                                {(item, index) => (
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
                                                id={item.id.toString()}
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
                                        <div class="flex items-center">
                                            <span class="text-lg text-ptext1 dark:text-ptext1-DM">
                                                {item.grade}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearGradeFiltersMobile}
                            >
                                {t("clearFilters.filterButtons.2.text")}
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

                        <div>
                            <div class="flex flex-row pl-2">
                                <div class="flex flex-wrap justify-between">
                                    <div class="w-4/5 px-2 ">
                                        {t("formLabels.secular")}
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="checkbox"
                                        class={`mr-2 leading-tight`}
                                        checked={selectedSecular()}
                                        onClick={(e) => {
                                            secularCheckboxClick(e);
                                          
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearSecularFilterMobile}
                            >
                                {t("clearFilters.filterButtons.6.text")}
                            </button>
                        </div>
                    </div>
                </Show>


                {/* downHostedFilter */}
                <Show when={showDownHosted() === true}>
                  <div class="subjects-pop-out rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600">
                    <button
                      class="w-full"
                      onClick={() => {
                        if (showFilters() === false) {
                          setShowDownHosted(false);
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
                          {t("formLabels.downHosted")}
                        </h2>
                      </div>
                    </button>

                    <div>
                      <div class="flex flex-row pl-2">
                        <div class="flex flex-wrap justify-between">
                          <div class="w-4/5 px-2 ">
                            {t("formLabels.downHosted")}
                          </div>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            class={`mr-2 leading-tight checkBoxHosted`}
                            checked={selectedHostedCheck()}
                            onClick={(e) => {
                              downHostedCheckboxClick(e);
                            }}
                          />
                        </div>
                      </div>
                      <div class="flex flex-row pl-2">
                        <div class="flex flex-wrap justify-between">
                          <div class="w-4/5 px-2 ">
                            {t("formLabels.downloadable")}
                          </div>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            class={`mr-2 leading-tight checkBoxDown`}
                            checked={selectedDownCheck()}
                            onClick={(e) => {
                              downCheckboxClick(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div class="my-2">
                      <button
                        class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                        onClick={clearDownHostedFilterMobile}
                      // onClick={clearSubjectFiltersMobile}
                      >
                        {t("clearFilters.filterButtons.8.text")}
                      </button>
                        </div>
                  </div>
                </Show>

                <Show when={showSubjects() === true}>
                    <div class="subjects-pop-out rounded-b border border-border1 bg-background1 shadow-2xl dark:border-border1-DM dark:bg-background1-DM dark:shadow-gray-600">
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

                        <div class="mb-2 pb-8">
                            {allSubjectInfo?.map((item) => (
                                <div class="flex flex-row pl-2">
                                    <div class="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={item.id}
                                            checked={item.checked}
                                            class={`subject ${item.id.toString()} mr-2 scale-125 leading-tight`}
                                            onClick={(e) =>
                                                subjectCheckboxClick(e)
                                            }
                                        />
                                    </div>

                                    <div class="flex w-full items-center text-start">
                                        <span class="w-full text-ptext1 dark:text-ptext1-DM">
                                            <p class="ml-4 border-b border-border1 py-2 text-lg text-ptext1 dark:border-border1-DM dark:text-ptext1-DM ">
                                                {item.name}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div class="my-2">
                            <button
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={clearSubjectFiltersMobile}
                            >
                                {t("clearFilters.filterButtons.1.text")}
                            </button>
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
};
