# views.py

from typing import Any
from django.shortcuts import render,redirect
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, viewsets
from rest_framework.exceptions import NotFound
from rest_framework import status

from .serializers import *

from firebase_admin import firestore

import requests
from requests.auth import HTTPBasicAuth
import msal
import pandas as pd
import json
import csv
import io

client_id = '7b333585-1a61-4b43-8346-176b4768deb0'
client_secret = '2028Q~4DWTjozVmME52f0wl1bgyfvVIG1OuyOcyH'  #'zjd8Q~L2VLMRnux3wSY8a.KcBTidJWYf4hR1VdBQ'
tenant_id = '2a9ff279-ccfd-4a1c-927d-a135e08fa83b'


redirect_uri = 'https://scs-inventory-1.onrender.com/login' 
#redirect_uri = 'http://localhost:8000/login'
#redirect_uri = http://localhost:5173/callback          #is the redirect URI for this sample server. It




scope= ['user.read', 'Files.Read','Files.ReadWrite.All'] #scope= ['https://graph.microsoft.com/.default']   #'https://graph.microsoft.com/.default' 'user.read', 'Files.Read'
authority = f'https://login.microsoftonline.com/{tenant_id}'

products_file_id = "01L6OT74XZQWC4U6CP65GKSMYXFJOKGJN3"
Arun_api_id="01L6OT74S2IDSJUIFYK5BIDSKMKK3UTRBY"
database_id="01L6OT74TOVKKPNPTNXFHKQZEQUR5SMKQW"
Assets_id="01L6OT74U5VQYOMTNMWVF3XUZGDZDULLN4"

# sharepoint_url="https://ibobscs-my.sharepoint.com/personal/support_ibobscs_com/Documents/"


app = msal.ConfidentialClientApplication(
                client_id, authority=authority,
                    client_credential=client_secret
                    )
class login(APIView):
    def get(self,request):
       
        login_url = app.get_authorization_request_url(scope, redirect_uri=redirect_uri)

        # Redirect to Microsoft login page
        # print(login_url)
        return Response({"redirect_url":login_url})
        
class AuthenticationCallbackView(APIView):
    def get(self,request):
        token_response = app.acquire_token_by_authorization_code(
        request.GET['code'], scope, redirect_uri=redirect_uri)

        print("token_response",token_response)
        if "access_token" in token_response:
            # print("print access token",token_response["access_token"])
            return Response({"access_token":token_response["access_token"]})
        else:
            raise NotFound(detail="Invalid Credentials", code=404)

        # api_url = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
        # headers = {'Authorization': 'Bearer '+ token_response["access_token"]}
        # drive_info = requests.get(api_url, headers=headers).json()

        


class Accessfiles(APIView):

    def __init__(self):
       self.mg_files=manage_files()

    def get(self,request):
       access_token = request.headers.get('Authorization')[len('Bearer '):]
       prod_list=self.mg_files.retrieve_file(access_token, products_file_id)
         

       if prod_list[0]:
            csv_data = csv.DictReader(prod_list[0])

            # Create an empty list to store the JSON data
            data = []
            # Loop through each row in the CSV file
            for row in csv_data:
                # Convert each row to a dictionary and add it to the list
                data.append(row)
                
            return Response({"products":data})
       else:
           raise NotFound(detail=prod_list[1]+":"+prod_list[2], code=prod_list[3])
       

       
    def post(self,request):
       
        access_token = request.headers.get('Authorization')[len('Bearer '):]
        file_content = request.data["content"]

        return self.mg_files.upload_file(access_token,"/databases/ file_name ",file_content)

class Assets(viewsets.ViewSet):
   
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.mg_files = manage_files()
        self.db = FirebaseClient("Assets")

    def create(self, request, *args, **kwargs):
        
        serializer = Assetserializer(data=request.data)
        serializer.is_valid(raise_exception=True)  
        try: 
            ser_data=serializer.data
            # ser_data["password"]=ser_data["eid"]=cmps[data["company"]] + self.db.get_by_id("auto_id")[company[ser_data["company"]]]
            Asset_id=self.db.create(ser_data["asset_id"],ser_data)["asset_id"]

            num=int(ser_data["asset_id"][3:])+1
            a_Asset_id=self.db.update("auto_id",{"auto_id":f"{num:03}"})
            return Response(Asset_id)
        except Exception as e:
            raise NotFound(detail=e, code=404)

    def list(self, request):
        try:
            lists = self.db.all()
            a_id=""
            for i in lists[::-1]:
                if(i["id"] == "auto_id"):
                            a_id=i["auto_id"]
                            lists.remove(i)
                            break
            data = Assetserializer(lists, many=True).data
            return Response({"Assets_list":data,"id":a_id})
        except Exception as e:
            raise NotFound(detail=e, code=404)

    def retrieve(self, request, pk=None):
        user = self.db.get_by_id(pk)
        if user:
            serializer = Assetserializer(user)
            return Response(serializer.data)

        raise NotFound(detail="User Not Found", code=404)

    def destroy(self, request, *args, **kwargs):
        try:
            pk = kwargs.get('pk')
            return Response(self.db.delete_by_id(pk), status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            raise NotFound(detail=e, code=404)

    def update(self, request, *args, **kwargs):
        try:
            pk = kwargs.get('pk')
            return Response(self.db.update(pk, request.data))
        except Exception as e:
            raise NotFound(detail=e, code=404)
     




class manage_files():
    def retrieve_file(self,access_token,file_id):

        endpoint = f'https://graph.microsoft.com/v1.0/me/drive/items/{file_id}/content'  #Arun_api:/database:/
        headers = {'Authorization': 'Bearer ' + access_token}
        response = requests.get(endpoint, headers=headers)
        if response.status_code == 200:
            return response.content.decode('utf-8'),response.status_code
        else:
   
            error_message = response.content.decode('utf-8')

            # Parse the JSON string to a dictionary
            error_dict = json.loads(error_message)
            return None,error_dict['error']['code'],error_dict['error']['message'],response.status_code

    def upload_file(self,access_token,file_id,file_content):

           # URL for uploading file to OneDrive
        upload_url =f'https://graph.microsoft.com/v1.0/me/drive/root:/Arun_api/{file_id}:/content'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'text/plain',
                }

        # Make POST request to upload file
        response = requests.put(upload_url, headers=headers, data=file_content)

        if response.status_code == 201:
            return Response({'message': 'File uploaded successfully'})
        else:
            return Response({'error': f'Failed to upload file: {response.text}'}, status=response.status_code)
        
        
    def modify_excel_file(self,file_content, column_name, new_value):
        # Load the Excel file content into a DataFrame
        df = pd.read_csv(file_content)
        # Modify the DataFrame as needed
        df.loc[df[column_name] == column_name, column_name] = new_value
        return df



class FirebaseClient():

    def __init__(self,collc):     
        self._db = firestore.client()
        self._collection = self._db.collection(collc)

    def create(self,id,data):
        """Create todo in firestore database"""
        doc_ref = self._collection.document(id)
        doc_ref.set(data)
        return data


    def update(self,id, data):
        """Update todo on firestore database using document id"""
        doc_ref = self._collection.document(id)
        doc_ref.update(data)
        return data
    


    def delete_by_id(self,id):
        """Delete todo on firestore database using document id"""
        self._collection.document(id).delete()
        return "Successfully Deleted"


    def get_by_id(self, id):
        """Get todo on firestore database using document id"""
        doc_ref = self._collection.document(id)
        doc = doc_ref.get().to_dict()
        return doc
    


    def all(self):
        """Get all todo from firestore database"""
        docs = self._collection.stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]


    def filter(self,field, condition, value):
        """Filter todo using conditions on firestore database"""
        docs = self._collection.where(field, condition, value).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in docs]




















































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
    
# Code for assest management
    
    #     def get(self,request):
    #    access_token = request.headers.get('Authorization')[len('Bearer '):]
    #    prod_list=self.mg_files.retrieve_file(access_token, Assets_id)
         
    #    if prod_list[0]:
    #         pass
    #    else:
    #        raise NotFound(detail=prod_list[1]+":"+prod_list[2], code=prod_list[3])
       

       
    # def post(self,request):
       
    #     access_token = request.headers.get('Authorization')[len('Bearer '):]
    #     file_content = request.data["content"]

    #     return self.mg_files.upload_file(access_token,"/Assets/IT Asset Audit.xlsx",file_content) 















    # ibob@123

    #  self.client_id = 'b19475b9-06d7-44e3-8c47-4b920cbf779c'
    #     self.client_secret = '.Zd8Q~s2LDFWhB0SYuyjKtgzgcEwiwMVIqDU3cn0'  #'zjd8Q~L2VLMRnux3wSY8a.KcBTidJWYf4hR1VdBQ'
    #     self.tenant_id = '65bd1062-a32c-4912-9c5b-3905d7839b57'
        

        # eyJ0eXAiOiJKV1QiLCJub25jZSI6IlptUHFBX013dnV1enVWRGw2VDVQRnFNZWQ0NWFqM2ljYi01LWVhSUVGT3ciLCJhbGciOiJSUzI1NiIsIng1dCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSIsImtpZCI6IlhSdmtvOFA3QTNVYVdTblU3Yk05blQwTWpoQSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yYTlmZjI3OS1jY2ZkLTRhMWMtOTI3ZC1hMTM1ZTA4ZmE4M2IvIiwiaWF0IjoxNzExNTUwNjg1LCJuYmYiOjE3MTE1NTA2ODUsImV4cCI6MTcxMTU1NTI2MiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQW5nZzd3REs2bW8wSC8wRkJzcXM4U0tlanRNeFZDYnhWVXBQYzVZQzFtZzNoVFBxdDZLdzJwV0plNUJxWVRDY1dGRmNvajJMbUFuMnRyT0p0VVJZcklKMEZCZDJ5T3Rib0FSc0RrYU9vbmFNPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoic3VwcG9ydC1pYm9ibyIsImFwcGlkIjoiN2IzMzM1ODUtMWE2MS00YjQzLTgzNDYtMTc2YjQ3NjhkZWIwIiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJpYm9iIiwiZ2l2ZW5fbmFtZSI6InN1cHBvcnQiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyNDAxOjQ5MDA6MWYyZDpjZWRjOjZjN2U6MWE3OmE0NDQ6NDczYyIsIm5hbWUiOiJzdXBwb3J0Iiwib2lkIjoiZWZhZDEyYmYtYThiYy00ZjVmLWE2ZTUtM2EzYjA0OTEyNDgyIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAyMDExNDc4NTUiLCJyaCI6IjAuQVhBQWVmS2ZLdjNNSEVxU2ZhRTE0SS1vT3dNQUFBQUFBQUFBd0FBQUFBQUFBQURFQUdvLiIsInNjcCI6IkZpbGVzLlJlYWQgRmlsZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJSVURWSl9oRTMzNWUtWkFXMm5SemprRFlDMWJ4eE9SbjZQRmxUeUQ1bGF3IiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiMmE5ZmYyNzktY2NmZC00YTFjLTkyN2QtYTEzNWUwOGZhODNiIiwidW5pcXVlX25hbWUiOiJzdXBwb3J0QGlib2JzY3MuY29tIiwidXBuIjoic3VwcG9ydEBpYm9ic2NzLmNvbSIsInV0aSI6IjBGYVB5aXBMVlV5UXY5bWRsOGhxQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiMER2cGlKZDdlWlEyWDhDbkt4SDZreUtPVWktdWNTSXJ3bjBqMG9HTFRtNCJ9LCJ4bXNfdGNkdCI6MTU5MDQ3NDU5MH0.eG77NqniHRgocuMT7ny9R8ImY0tZD1dOdGOFGGOOmRyKy4YinKkXeUT0-ShlGuhpiXGG7E98Qr3sVZqno_z9GVj2M5rx4ZF9TUtP5k4_JykRcKodFAwCYAZAH43ZzuLVijjr9D1B8L3uIUCHwgH5uMXL0V9hTb6HS4upiOjmD8WDfW_1vCQYhpKmWBtVqNG5baGrxFK_pkDgBeU3hn_9i4giqAJjQd79lSp4rqTshlsed0aEG6YQ2J1WLzwfuDc18cm38HLB6kCsc8P6uyF6uHp_sNekDxuMjCxl9PaXpS7A6TbNoOByZgrYW6H5C_vaW9-HlJYjMhYoyOcxh_tNlg

        # product_id	
        # product_name	
        # quantity_in_stock	
        # unit_price	
        # expiration_date	
        # supplier_name	
        # category	
        # location_in_warehouse	
        # last_restock_date	
        # is_discontinued
