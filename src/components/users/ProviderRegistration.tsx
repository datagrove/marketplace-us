import { Component, Suspense, createEffect, createResource, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import type { AuthSession } from '@supabase/supabase-js'
import UserImage from './UserImage'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//Send the data to the APIRoute and wait for a JSON response see src/pages/api for APIRoute
async function postFormData(formData: FormData) {
    const response = await fetch("/api/providerProfileSubmit", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    console.log(data.message);
    //Checks the API response for the redirect and sends them to the redirect page if there is one
    if (data.redirect) {
        //TODO: Not sure how to deal with internationalization here
        alert(data.message)
        window.location.href = `/${lang}` + data.redirect;
    }
    return data;
}

//Component that creates the form and collects the data
export const ProviderRegistration: Component = () => {
    const [session, setSession] = createSignal<AuthSession | null>(null)
    const [formData, setFormData] = createSignal<FormData>()
    const [response] = createResource(formData, postFormData)
    const [imageUrl, setImageUrl] = createSignal<string | null>(null)
    const [phone,setPhone] = createSignal<string>("")

    const regularExpressionPhone = new RegExp("^[0-9]{8}$");

    createEffect(async () => {
        const { data, error } = await supabase.auth.getSession()
        setSession(data.session)

        //Create/Fill dropdown options for the form based on each selection if there is a session (Meaning the user is signed in)
        if (session()) {
            //Will create a dropdown of all the countries in the database (Currently only Costa Rica)
            try {
                const { data: countries, error } = await supabase.from('country').select('*');
                if (error) {
                    console.log("supabase error: " + error.message)
                } else {

                    countries.forEach(country => {
                        let countryOption = new Option(country.country, country.id)
                        document.getElementById("country")?.append((countryOption))
                    })
                }
            }
            catch (error) {
                console.log("Other error: " + error)
            }

            //Will create a list of Major Municipalities based on the selected country
            try {
                const { data: majorMunicipality, error: errorMajorMunicipality } = await supabase.from('major_municipality').select('*');
                if (errorMajorMunicipality) {
                    console.log("supabase error: " + errorMajorMunicipality.message)
                } else {

                    document.getElementById("country")?.addEventListener('change', () => {
                        let municipalitySelect = document.getElementById("MajorMunicipality") as HTMLSelectElement

                        let length = municipalitySelect?.length

                        for (let i = length - 1; i > -1; i--) {
                            if (municipalitySelect.options[i].value !== "") {
                                municipalitySelect.remove(i)
                            }
                        }
                        let filteredMunicipality = majorMunicipality.filter(municipality => municipality.country == (document.getElementById("country") as HTMLSelectElement)?.value)
                        filteredMunicipality.forEach(municipality => {
                            let municipalityOption = new Option(municipality.major_municipality, municipality.id)
                            document.getElementById("MajorMunicipality")?.append((municipalityOption))
                        })
                    })

                }
            } catch (error) {
                console.log("Other error: " + error)
            }

            //Creates drop down options for Minor Municipality based on selected Major Municipality
            try {
                const { data: minorMunicipality, error: errorMinorMunicipality } = await supabase.from('minor_municipality').select('*');
                if (errorMinorMunicipality) {
                    console.log("supabase error: " + errorMinorMunicipality.message)
                } else {

                    document.getElementById("MajorMunicipality")?.addEventListener('change', () => {
                        let municipalitySelect = document.getElementById("MinorMunicipality") as HTMLSelectElement

                        let length = municipalitySelect?.length

                        for (let i = length - 1; i > -1; i--) {
                            if (municipalitySelect.options[i].value !== "") {
                                municipalitySelect.remove(i)
                            }
                        }

                        let filteredMunicipality = minorMunicipality.filter(municipality => municipality.major_municipality == (document.getElementById("MajorMunicipality") as HTMLSelectElement)?.value)
                        filteredMunicipality.forEach(municipality => {
                            let municipalityOption = new Option(municipality.minor_municipality, municipality.id)
                            document.getElementById("MinorMunicipality")?.append((municipalityOption))
                        })
                    })
                }
            } catch (error) {
                console.log("Other error: " + error)
            }

            //Creates filtered drop down options for Governing District base on selected Minor Municipality
            try {
                const { data: governingDistrict, error: errorGoverningDistrict } = await supabase.from('governing_district').select('*');
                if (errorGoverningDistrict) {
                    console.log("supabase error: " + errorGoverningDistrict.message)
                } else {

                    document.getElementById("MinorMunicipality")?.addEventListener('change', () => {
                        let districtSelect = document.getElementById("GoverningDistrict") as HTMLSelectElement

                        let length = districtSelect?.length

                        for (let i = length - 1; i > -1; i--) {
                            if (districtSelect.options[i].value !== "") {
                                districtSelect.remove(i)
                            }
                        }

                        let filteredDistrict = governingDistrict.filter(district => district.minor_municipality == (document.getElementById("MinorMunicipality") as HTMLSelectElement)?.value)
                        filteredDistrict.forEach(district => {
                            let districtOption = new Option(district.governing_district, district.id)
                            document.getElementById("GoverningDistrict")?.append((districtOption))
                        })
                    })
                }
            } catch (error) {
                console.log("Other error: " + error)
            }

            //If the user is not signed in then tell them to sign in and send them to the login page
        } else {
            alert(t('messages.createProviderAccount'))
            location.href = `/${lang}/login`
        }
    })

    //This happens with the form is submitted. Builds the form data to be sent to the APIRoute.
    //Must send the access_token and refresh_token to the APIRoute because the server can't see the local session
    function submit(e: SubmitEvent) {
        e.preventDefault();

        if(regularExpressionPhone.test(phone())){
        const formData = new FormData(e.target as HTMLFormElement)
        formData.append("access_token", session()?.access_token!)
        formData.append("refresh_token", session()?.refresh_token!)
        formData.append("lang", lang)
        if (imageUrl() !== null) {
            formData.append("image_url", imageUrl()!)
        }
        setFormData(formData)

        } else if(!regularExpressionPhone.test(phone())) {  {
            alert(t("messages.phoneLackRequirements"));
    }

    }
}

    //Actual Form that gets displayed for users to fill
    return (
        <div class=''>
            <form onSubmit={submit}>
                <div class="">
                    <div class="flex flex-row justify-between">
                        <label for="FirstName" class="text-ptext1 dark:text-ptext1-DM">
                            {t("formLabels.firstName")}:
                        </label>
                        <div class="group flex items-center relative mr-2">
                            <svg class="peer w-4 h-4 border-2 bg-icon1 dark:bg-background1-DM fill-iconbg1 dark:fill-iconbg1-DM  border-border1 dark:border-none rounded-full" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <g>
                                    <path d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"/>
                                </g>
                            </svg>

                            <span
                                class="peer-hover:visible transition-opacity bg-background2 dark:bg-background2-DM text-sm text-ptext2 dark:text-ptext2-DM rounded-md absolute 
                                md:translate-x-1/4 -translate-x-full -translate-y-2/3 md:translate-y-0 invisible m-4 mx-auto p-2 w-48">
                                {t("toolTips.firstName")}
                            </span>

                        </div>
                    </div>
                    <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        class="rounded w-full mb-4 px-1 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                        required
                    />
                </div>

                <div class="">
                    <div class="flex flex-row justify-between">
                        <label for="LastName" class="text-ptext1 dark:text-ptext1-DM">
                            {t("formLabels.lastName")}:
                        </label>
                        <div class="group flex items-center relative mr-2">
                            <svg class="peer w-4 h-4 border-2 bg-icon1 dark:bg-background1-DM fill-iconbg1 dark:fill-iconbg1-DM  border-border1 dark:border-none rounded-full" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <g>
                                    <path d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"/>
                                </g>
                            </svg>

                            <span
                                class="peer-hover:visible transition-opacity bg-background2 dark:bg-background2-DM text-sm text-ptext2 dark:text-ptext2-DM rounded-md absolute 
                                md:translate-x-1/4 -translate-x-full -translate-y-2/3 md:translate-y-0 invisible m-4 mx-auto p-2 w-48">
                                {t("toolTips.lastName")}
                            </span>

                        </div>
                    </div>
                    <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        class="rounded w-full mb-4 px-1 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                        required
                    />
                </div>

                <div class="">
                    <div class="flex flex-row justify-between">
                        <label for="ProviderName" class="text-ptext1 dark:text-ptext1-DM">
                            {t('formLabels.providerName')}:
                        </label>
                        <div class="group flex items-center relative mr-2">
                            <svg class="peer w-4 h-4 border-2 bg-icon1 dark:bg-background1-DM fill-iconbg1 dark:fill-iconbg1-DM  border-border1 dark:border-none rounded-full" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <g>
                                    <path d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"/>
                                </g>
                            </svg>

                            <span
                                class="peer-hover:visible transition-opacity bg-background2 dark:bg-background2-DM text-sm text-ptext2 dark:text-ptext2-DM rounded-md absolute 
                                md:translate-x-1/4 -translate-x-full -translate-y-2/3 md:translate-y-0 invisible m-4 mx-auto p-2 w-48">
                                {t("toolTips.displayName")}
                            </span>

                        </div>
                    </div>
                    <input
                        type="text"
                        id="ProviderName"
                        name="ProviderName"
                        class="rounded w-full mb-4 px-1 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                    />
                </div>

                <div class="">
                    <div class="flex flex-row justify-between">
                        <label for="Phone" class="text-ptext1 dark:text-ptext1-DM">{t('formLabels.phone')}:
                        </label>
                        <div class="group flex items-center relative mr-2">
                            <svg class="peer w-4 h-4 border-2 bg-icon1 dark:bg-background1-DM fill-iconbg1 dark:fill-iconbg1-DM  border-border1 dark:border-none rounded-full" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <g>
                                    <path d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                    C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                    c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                    s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                    c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                    c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                    C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                    c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                    C314.716,152.979,297.039,174.043,273.169,176.123z"/>
                                </g>
                            </svg>

                            <span
                                class="peer-hover:visible transition-opacity bg-background2 dark:bg-background2-DM text-sm text-ptext2 dark:text-ptext2-DM rounded-md absolute 
                                md:translate-x-1/4 -translate-x-full -translate-y-2/3 md:translate-y-0 invisible m-4 mx-auto p-2 w-48">
                                {t("toolTips.providerPhone")}
                            </span>

                        </div>
                    </div>
                    <input
                        type="text"
                        id="Phone"
                        class="rounded w-full mb-4 px-1 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                        name="Phone"
                        value={phone()}
                        required
                        onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </div>

                  

                <label for="country" class="text-ptext1 dark:text-ptext1-DM">{t('formLabels.country')}:
                    <select
                        id="country"
                        class="ml-2 rounded mb-4 focus:border-highlight1 dark:focus:border-highlight1-DM border border-inputBorder1 dark:border-inputBorder1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1  dark:text-ptext2-DM"
                        name="country"
                        required>
                        <option value="">-</option>
                    </select>
                </label>

                <br />

                <label for="MajorMunicipality" class="text-ptext1 dark:text-ptext1-DM">{t('formLabels.majorMunicipality')}:
                    <select
                        id="MajorMunicipality"
                        class="ml-2 rounded mb-4 focus:border-highlight1 dark:focus:border-highlight1-DM border border-inputBorder1 dark:border-inputBorder1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1  dark:text-ptext2-DM"
                        name="MajorMunicipality"
                        required
                    >
                        <option value="">-</option>
                    </select>
                </label>

                <br />

                <label for="MinorMunicipality" class="text-ptext1 dark:text-ptext1-DM">{t('formLabels.minorMunicipality')}:
                    <select
                        id="MinorMunicipality"
                        class="ml-2 rounded mb-4 focus:border-highlight1 dark:focus:border-highlight1-DM border border-inputBorder1 dark:border-inputBorder1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1  dark:text-ptext2-DM"
                        name="MinorMunicipality"
                        required>
                        <option value="">-</option>
                    </select>
                </label>

                <br />

                <label for="GoverningDistrict" class="text-ptext1 dark:text-ptext1-DM">{t('formLabels.governingDistrict')}:
                    <select
                        id="GoverningDistrict"
                        class="ml-2 rounded mb-4 focus:border-highlight1 dark:focus:border-highlight1-DM border border-inputBorder1 dark:border-inputBorder1-DM focus:border-2 focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1  dark:text-ptext2-DM"
                        name="GoverningDistrict"
                        required>
                        <option value="">-</option>
                    </select>
                </label>


                <div class="mb-4 flex justify-center">
                    <div class="">
                        <div class="flex flex-row justify-end">
                            <div class="group flex items-center relative mr-2">
                                <svg class="peer w-4 h-4 border-2 bg-icon1 dark:bg-background1-DM fill-iconbg1 dark:fill-iconbg1-DM  border-border1 dark:border-none rounded-full" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512">
                                    <g>
                                        <path d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992
                                        C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007
                                        c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667
                                        s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822
                                        c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497
                                        c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242
                                        C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467
                                        c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458
                                        C314.716,152.979,297.039,174.043,273.169,176.123z"/>
                                    </g>
                                </svg>

                                <span
                                    class="peer-hover:visible transition-opacity bg-background2 dark:bg-background2-DM text-sm text-ptext2 dark:text-ptext2-DM rounded-md absolute 
                md:translate-x-1/4 -translate-x-full -translate-y-2/3 md:translate-y-0 invisible m-4 mx-auto p-2 w-48">
                                    {t("toolTips.profileImage")}
                                </span>

                            </div>
                        </div>
                        <UserImage
                            url={imageUrl()}
                            size={150}
                            onUpload={(e: Event, url: string) => {
                                setImageUrl(url);
                            }}
                        />
                    </div>

                </div>

                <div class="flex justify-center">
                    <button class="btn-primary">{t('buttons.register')}</button>
                </div>

                <Suspense>{response() && <p class="mt-2 font-bold text-center text-alert1 dark:text-alert1-DM">{response().message}</p>}</Suspense>
            </form>
        </div>
    );
}

