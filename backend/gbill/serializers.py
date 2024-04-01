from rest_framework import serializers

class Assetserializer(serializers.Serializer):
    asset_id=serializers.CharField(max_length=50)
    state=	serializers.CharField(max_length=200)
    location=	serializers.CharField(max_length=200)
    customer=	serializers.CharField(max_length=200)
    asset =serializers.CharField(max_length=200)
    type	=serializers.CharField(max_length=200)
    category=	serializers.CharField(max_length=200)
    make_model	=serializers.IntegerField()
    asset_serial_no	=serializers.IntegerField()
    working_status	=serializers.CharField(max_length=200)
    usable_stock_status	=serializers.CharField(max_length=200)
    remarks=serializers.CharField(max_length=500)
    date	=serializers.DateField()
    name_of_audit_person=serializers.CharField(max_length=200)
