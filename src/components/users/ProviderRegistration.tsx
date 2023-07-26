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
                            if (municipalitySelect.options[i].value !== "-1") {
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
                            if (municipalitySelect.options[i].value !== "-1") {
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
                            if (districtSelect.options[i].value !== "-1") {
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
        const formData = new FormData(e.target as HTMLFormElement)
        formData.append("access_token", session()?.access_token!)
        formData.append("refresh_token", session()?.refresh_token!)
        if(imageUrl() !== null){
            formData.append("image_url", imageUrl()!)
        } 
        setFormData(formData)
    }

    //Actual Form that gets displayed for users to fill
    return (
        <div>
            <form onSubmit={submit}>
                <label for="FirstName">{t('formLabels.firstName')}:
                    <input type="text" id="FirstName" name="FirstName" required />
                </label>

                <label for="LastName">{t('formLabels.lastName')}:
                    <input type="text" id="LastName" name="LastName" required />
                </label>


                <label for="ProviderName">{t('formLabels.providerName')}:
                    <input type="text" id="ProviderName" name="ProviderName" />
                </label>

                <label for="Phone">{t('formLabels.phone')}:
                    <input type="text" id="Phone" name="Phone" required />
                </label>

                <label for="country">{t('formLabels.country')}:
                    <select id="country" name="country" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                <label for="MajorMunicipality">{t('formLabels.majorMunicipality')}:
                    <select id="MajorMunicipality" name="MajorMunicipality" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                <label for="MinorMunicipality">{t('formLabels.minorMunicipality')}:
                    <select id="MinorMunicipality" name="MinorMunicipality" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                <label for="GoverningDistrict">{t('formLabels.governingDistrict')}:
                    <select id="GoverningDistrict" name="GoverningDistrict" required>
                        <option value="-1">-</option>
                    </select>
                </label>

                {/* Allows upload of profile picture using the UserImage component  */}
                <UserImage
                    url={imageUrl()}
                    size={150}
                    onUpload={(e: Event, url: string) => {
                        setImageUrl(url)
                    }}
                />

                <button class="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{t('buttons.register')}</button>

                <Suspense>{response() && <p>{response().message}</p>}</Suspense>
            </form>
        </div>
    );
}

