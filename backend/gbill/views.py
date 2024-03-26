# views.py

from typing import Any
from django.shortcuts import render,redirect
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from requests.auth import HTTPBasicAuth
import msal


client_id = '7b333585-1a61-4b43-8346-176b4768deb0'
client_secret = '2028Q~4DWTjozVmME52f0wl1bgyfvVIG1OuyOcyH'  #'zjd8Q~L2VLMRnux3wSY8a.KcBTidJWYf4hR1VdBQ'
tenant_id = '2a9ff279-ccfd-4a1c-927d-a135e08fa83b'
redirect_uri = 'http://localhost:8000/callback/'
scope= ['user.read', 'Files.Read'] #scope= ['https://graph.microsoft.com/.default']   #'https://graph.microsoft.com/.default' 'user.read', 'Files.Read'
authority = f'https://login.microsoftonline.com/{tenant_id}'


app = msal.ConfidentialClientApplication(
                client_id, authority=authority,
                    client_credential=client_secret
                    )
class login(APIView):
    def get(self,request):
       
        login_url = app.get_authorization_request_url(scope, redirect_uri=redirect_uri)

        # Redirect to Microsoft login page
        return redirect(login_url)
        
class AuthenticationCallbackView(APIView):
    def get(self,request):
        token_response = app.acquire_token_by_authorization_code(
        request.GET['code'], scope, redirect_uri=redirect_uri)

        api_url = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
        headers = {'Authorization': 'Bearer '+ token_response["access_token"]}
        drive_info = requests.get(api_url, headers=headers).json()

        return Response(drive_info)


























































        # access_token="eyJ0eXAiOiJKV1QiLCJub25jZSI6IkpMVFVfYVhPVHpiVjJZY1hFZzhrckhtcWg1YmQ2SW9HUE96OEpUWlVDc28iLCJhbGciOiJSUzI1NiIsIng1dCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSIsImtpZCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82NWJkMTA2Mi1hMzJjLTQ5MTItOWM1Yi0zOTA1ZDc4MzliNTcvIiwiaWF0IjoxNzA5OTk0ODYyLCJuYmYiOjE3MDk5OTQ4NjIsImV4cCI6MTcxMDAwMDMxNCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQWNTT0VPdCtGNWtVNHlQbWU3bEU2TnlMSlRZSkRKSWVvdGVMRXJMZWp2RXZTbldlTGdieko0WGhocDdyNHZydGhPejV5NGRSY2pJcGp0SjNnN2lwUGhUUGtnMlRxRkxYNi9weGlGenBodk5zPSIsImFsdHNlY2lkIjoiMTpsaXZlLmNvbTowMDAzNDAwMTZDRjg4NTRBIiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJzY3MtaW52IiwiYXBwaWQiOiJiMTk0NzViOS0wNmQ3LTQ0ZTMtOGM0Ny00YjkyMGNiZjc3OWMiLCJhcHBpZGFjciI6IjEiLCJlbWFpbCI6ImFydW5rajIwM0BvdXRsb29rLmNvbSIsImZhbWlseV9uYW1lIjoiSiIsImdpdmVuX25hbWUiOiJBcnVua3VtYXIiLCJpZHAiOiJsaXZlLmNvbSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI3LjUuNjUuMTg0IiwibmFtZSI6IkFydW5rdW1hciBKIiwib2lkIjoiZTdiMzg4NTEtZDQxNy00ZDg5LWJmNWEtNGFmNGJkNGMzYzlhIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAzNUZDMzdCM0MiLCJyaCI6IjAuQVNzQVloQzlaU3lqRWttY1d6a0YxNE9iVndNQUFBQUFBQUFBd0FBQUFBQUFBQURDQUdFLiIsInNjcCI6IkZpbGVzLlJlYWQgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiVUxvcXNNak9uSTUxM0hSMFJzWEdULUJpUmFEQ0o4OFVPeWRZNEhoU1JXOCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6IjY1YmQxMDYyLWEzMmMtNDkxMi05YzViLTM5MDVkNzgzOWI1NyIsInVuaXF1ZV9uYW1lIjoibGl2ZS5jb20jYXJ1bmtqMjAzQG91dGxvb2suY29tIiwidXRpIjoiSEpiYlgwbEJkVVdycFNMbTlwTlJBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJkYUNkQWN4TWlVTGV6bzJzanV4b2l0VGxDd2V2QzkwcFJnX3pIRm56OTBRIn0sInhtc190Y2R0IjoxNzA5OTg2Njk0fQ.nF9sfmCon_zqTMdGtOZUXZQP0Kne0sjBnjLLo8alakSH6CQqk1BNTk6_aglAQ4nDge_eTFP_xezGjWrM0z-_3D7_0AcyST26sTkRTU3Wvyes4ZpuNfizCCPk5R9Q4_Bi68x8WV-3iKfxxJpDO6X59OT7V21Felg8XaZTlYUehyN1BzpIl11mSl0Lj2eVsd3cr1tkUNe4h1CDtsaAZvz2aHl5NUpFL05Fd6UnGn4EicrkstKSpVD6HFPDva0zfSlLxEDfdFqOAx2ldZuqUCMs1z1rY4gfAJXixgBVuDVsoaFYqoTaTFfcgESplP3tyOa6iheBl5L-OYH9P7x5UYo05w"

    #  flow code:
    #  def get(self,request):

    #     global_token_cache = msal.TokenCache()  # The TokenCache() is in-memory.
    # # See more options in https://msal-python.readthedocs.io/en/latest/#tokencache

    #     # Create a preferably long-lived app instance, to avoid the overhead of app creation
    #     cca = msal.PublicClientApplication(
    #         self.client_id, authority=self.authority,
    #         token_cache=global_token_cache
    #     )

    #     # result = cca.acquire_token_for_client(scopes=self.scope)

    #     result = None

    #     # Note: If your device-flow app does not have any interactive ability, you can
    #     #   completely skip the following cache part. But here we demonstrate it anyway.
    #     # We now check the cache to see if we have some end users signed in before.
    #     accounts = cca.get_accounts()
    #     if accounts:
    #         # logging.info("Account(s) exists in cache, probably with token too. Let's try.")
    #         print("Pick the account you want to use to proceed:")
    #         for a in accounts:
    #             print(a["username"])
    #         # Assuming the end user chose this one
    #         chosen = accounts[0]
    #         # Now let's try to find a token in cache for this account
    #         result = cca.acquire_token_silent(self.scope, account=chosen)

    #     if not result:
            

    #         flow = cca.initiate_device_flow(scopes=self.scope)
    #         if "user_code" not in flow:
    #             raise ValueError(
    #                 "Fail to create device flow. Err: %s" )

    #         print(flow["message"])
    #         # sys.stdout.flush()  # Some terminal needs this to ensure the message is shown

    #         # Ideally you should wait here, in order to save some unnecessary polling
    #         # input("Press Enter after signing in from another device to proceed, CTRL+C to abort.")

    #         result = cca.acquire_token_by_device_flow(flow)  # By default it will block
    #     #         # You can follow this instruction to shorten the block time
    #     #         #    https://msal-python.readthedocs.io/en/latest/#msal.PublicClientApplication.acquire_token_by_device_flow
    #     #         # or you may even turn off the blocking behavior,
    #     #         # and then keep calling acquire_token_by_device_flow(flow) in your own customized loop.

    #     if "access_token" in result:
    #         print("_callback_view")

    #         api_url = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
    #         headers = {'Authorization': 'Bearer '+ result['access_token']}
    #         drive_info = requests.get(api_url, headers=headers).json()

    #         return Response(drive_info)
    #     else:
    #         return Response("Token acquisition failed:"+str(result))  # Examine result["error_description"] etc. to diagnose error
#  Callback get method:
    # def get(self, request):
    #     code = request.query_params.get('code')
        
    #     if not code:
    #         return Response({'error': 'Authorization code not found'}, status=400)   

    #     token_url = self.authority+'/oauth2/v2.0/token'
    #     token_data = {
    #     'grant_type': 'authorization_code',
    #     'client_id': self.client_id,
    #     'client_secret': self.client_secret,
    #     'code': code,
    #     'redirect_uri': self.redirect_uri,
    #     'scope': self.scope,
    #     }
    #     response = requests.post(token_url, data=token_data)
    #     access_token= response.json().get('access_token')
    
    #     print("_callback")

    #     api_url = 'https://graph.microsoft.com/v1.0/me/'
    #     headers = {'Authorization': f'Bearer {access_token}'}
    #     drive_info = requests.get(api_url, headers=headers).json()

    #     return Response(response.json())


#    cca = ConfidentialClientApplication(
#             self.client_id,
#             authority=self.authority,
#             client_credential=self.client_secret
#         )
#         auth_url = cca.get_authorization_request_url(
#             self.scope,
#             redirect_uri=self.redirect_uri
#         )
#         return redirect(auth_url)

        # cca = ConfidentialClientApplication(
        #     self.client_id,
        #     authority=self.authority,
        #     client_credential=self.client_secret
        # )

        # token_response = cca.acquire_token_by_authorization_code(
        #     code,
        #     scopes=self.scope,
        #     redirect_uri=self.redirect_uri
        # )

        # access_token = token_response['access_token']
    

    #  self.client_id = 'b19475b9-06d7-44e3-8c47-4b920cbf779c'
    #     self.client_secret = '.Zd8Q~s2LDFWhB0SYuyjKtgzgcEwiwMVIqDU3cn0'  #'zjd8Q~L2VLMRnux3wSY8a.KcBTidJWYf4hR1VdBQ'
    #     self.tenant_id = '65bd1062-a32c-4912-9c5b-3905d7839b57'